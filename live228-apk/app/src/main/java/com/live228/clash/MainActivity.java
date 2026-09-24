package com.live228.clash;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;

import io.github.jwdeveloper.tiktok.TikTokLive;
import io.github.jwdeveloper.tiktok.live.LiveClient;
import io.github.jwdeveloper.tiktok.live.builder.LiveClientBuilder;

public class MainActivity extends Activity {
    private static final String GAME_URL = "file:///android_asset/game/index.html";

    private final Object clientLock = new Object();
    private final ExecutorService liveExecutor = Executors.newSingleThreadExecutor();

    private WebView webView;
    private LiveClient liveClient;
    private String activeUsername = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        buildWebView();
    }

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    private void buildWebView() {
        webView = new WebView(this);
        webView.setBackgroundColor(Color.BLACK);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.addJavascriptInterface(new AndroidLiveBridge(), "AndroidLive");
        webView.setWebViewClient(new WebViewClient());

        setContentView(webView);
        webView.loadUrl(GAME_URL);
    }

    public final class AndroidLiveBridge {
        @JavascriptInterface
        public void connect(String username) {
            connectTikTok(username);
        }

        @JavascriptInterface
        public void disconnect() {
            disconnectTikTok();
        }

        @JavascriptInterface
        public void openTikTok() {
            runOnUiThread(MainActivity.this::openTikTok);
        }
    }

    private void connectTikTok(String rawUsername) {
        final String username = rawUsername == null
                ? ""
                : rawUsername.trim().replaceFirst("^@", "");

        if (username.isEmpty()) {
            emitStatus("error", "", "Entre ton @username TikTok.", null);
            return;
        }

        disconnectTikTok();
        activeUsername = username;
        emitStatus("connecting", username, "Connexion directe au LIVE TikTok…", null);

        liveExecutor.execute(() -> {
            try {
                LiveClientBuilder builder = TikTokLive.newClient(username);

                builder.configure(settings -> {
                    settings.setClientLanguage("fr");
                    settings.setPrintToConsole(false);
                    settings.setLogLevel(Level.WARNING);
                    settings.setRetryOnConnectionFailure(false);
                });

                builder.onConnecting((client, event) ->
                        emitStatus("connecting", username, "TikTok répond, ouverture du flux LIVE…", null));

                builder.onConnected((client, event) -> {
                    synchronized (clientLock) {
                        liveClient = client;
                    }
                    Integer viewers = null;
                    try {
                        viewers = client.getRoomInfo().getViewersCount();
                    } catch (Throwable ignored) {
                    }
                    emitStatus("connected", username, "LIVE connecté. Les interactions alimentent le jeu.", viewers);
                });

                builder.onRoomInfo((client, event) -> {
                    int viewers = event.getRoomInfo().getViewersCount();
                    emitStatus("connected", username, null, viewers);
                });

                builder.onJoin((client, event) ->
                        emitUserEvent("member", event.getUser().getName(), null, 0, null, 0, 1));

                builder.onComment((client, event) ->
                        emitUserEvent("comment", event.getUser().getName(), event.getText(), 0, null, 0, 1));

                builder.onLike((client, event) ->
                        emitUserEvent("like", event.getUser().getName(), null, event.getLikes(), null, 0, 1));

                builder.onFollow((client, event) ->
                        emitUserEvent("follow", event.getUser().getName(), null, 0, null, 0, 1));

                builder.onShare((client, event) ->
                        emitUserEvent("share", event.getUser().getName(), null, 0, null, 0, 1));

                builder.onGift((client, event) -> {
                    String giftName = event.getGift() == null ? "gift" : event.getGift().getName();
                    int diamonds = event.getGift() == null ? 0 : event.getGift().getDiamondCost();
                    int repeat = Math.max(1, event.getCombo());
                    emitUserEvent("gift", event.getUser().getName(), null, 0, giftName, diamonds, repeat);
                });

                builder.onReconnecting((client, event) ->
                        emitStatus("reconnecting", username, "Reconnexion au LIVE…", null));

                builder.onLiveEnded((client, event) ->
                        emitStatus("ended", username, "Le LIVE TikTok est terminé.", 0));

                builder.onDisconnected((client, event) ->
                        emitStatus("disconnected", username, "Connexion TikTok fermée.", null));

                builder.onError((client, event) -> {
                    Throwable ex = event.getException();
                    String message = ex == null ? "Erreur TikTok LIVE." : readableError(ex);
                    emitStatus("error", username, message, null);
                });

                LiveClient client = builder.build();
                synchronized (clientLock) {
                    liveClient = client;
                }
                client.connect();
            } catch (Throwable ex) {
                synchronized (clientLock) {
                    liveClient = null;
                }
                emitStatus("error", username, readableError(ex), null);
            }
        });
    }

    private void disconnectTikTok() {
        LiveClient current;
        synchronized (clientLock) {
            current = liveClient;
            liveClient = null;
        }

        if (current != null) {
            liveExecutor.execute(() -> {
                try {
                    current.disconnect();
                } catch (Throwable ignored) {
                }
            });
        }

        if (!activeUsername.isEmpty()) {
            emitStatus("disconnected", activeUsername, "Connexion TikTok arrêtée.", null);
        }
    }

    private void emitUserEvent(
            String type,
            String userName,
            String text,
            int count,
            String giftName,
            int diamonds,
            int repeatCount
    ) {
        try {
            JSONObject user = new JSONObject();
            user.put("name", userName == null || userName.isEmpty() ? "Invité" : userName);

            JSONObject event = new JSONObject();
            event.put("type", type);
            event.put("user", user);

            if (text != null) event.put("text", text);
            if (count > 0) event.put("count", count);

            if ("gift".equals(type)) {
                event.put("gift", diamonds >= 100 ? "star" : "rose");
                event.put("giftName", giftName == null ? "cadeau" : giftName);
                event.put("diamonds", diamonds);
                event.put("repeatCount", repeatCount);
            }

            callJs("Live228NativeEvent", event.toString());
        } catch (JSONException ignored) {
        }
    }

    private void emitStatus(
            String state,
            String username,
            String message,
            Integer viewers
    ) {
        try {
            JSONObject status = new JSONObject();
            status.put("state", state);
            if (username != null && !username.isEmpty()) status.put("username", username);
            if (message != null && !message.isEmpty()) status.put("message", message);
            if (viewers != null) status.put("viewers", viewers);
            callJs("Live228NativeStatus", status.toString());
        } catch (JSONException ignored) {
        }
    }

    private void callJs(String function, String jsonString) {
        if (webView == null) return;
        final String script = "window." + function + " && window." + function + "("
                + JSONObject.quote(jsonString) + ");";
        runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    private String readableError(Throwable ex) {
        Throwable root = ex;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }

        String message = root.getMessage();
        if (message == null || message.trim().isEmpty()) {
            message = root.getClass().getSimpleName();
        }

        String lower = message.toLowerCase();
        if (lower.contains("offline") || lower.contains("not found")) {
            return "TikTok ne détecte pas @" + activeUsername
                    + " comme LIVE. Démarre d'abord le LIVE, attends quelques secondes, puis réessaie.";
        }
        return message;
    }

    private void openTikTok() {
        Intent launch = getPackageManager().getLaunchIntentForPackage("com.zhiliaoapp.musically");
        if (launch == null) {
            launch = getPackageManager().getLaunchIntentForPackage("com.ss.android.ugc.trill");
        }

        try {
            if (launch != null) {
                startActivity(launch);
            } else {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.tiktok.com/")));
            }
        } catch (ActivityNotFoundException e) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.tiktok.com/")));
        }
    }

    @Override
    protected void onDestroy() {
        disconnectTikTok();
        liveExecutor.shutdownNow();
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
