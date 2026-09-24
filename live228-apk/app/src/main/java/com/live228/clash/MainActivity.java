package com.live228.clash;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.PictureInPictureParams;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Rational;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;

import io.github.jwdeveloper.tiktok.TikTokLive;
import io.github.jwdeveloper.tiktok.live.LiveClient;
import io.github.jwdeveloper.tiktok.live.builder.LiveClientBuilder;

public class MainActivity extends Activity {
    private static final String GAME_URL = "file:///android_asset/game/index.html";

    private final Object clientLock = new Object();
    private final ScheduledExecutorService liveExecutor = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean retryScheduled = new AtomicBoolean(false);
    private final AtomicBoolean connectAttemptRunning = new AtomicBoolean(false);
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private WebView webView;
    private LiveClient liveClient;

    private volatile boolean smartMode = false;
    private volatile boolean connected = false;
    private volatile boolean manualStop = false;
    private volatile int retryCount = 0;
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
            startSmartLive(username);
        }

        @JavascriptInterface
        public void startSmartLive(String username) {
            MainActivity.this.startSmartLive(username);
        }

        @JavascriptInterface
        public void disconnect() {
            stopSmartLive();
        }

        @JavascriptInterface
        public void openTikTok() {
            runOnUiThread(MainActivity.this::openTikTok);
        }

        @JavascriptInterface
        public boolean isPipSupported() {
            return supportsPip();
        }
    }

    private void startSmartLive(String rawUsername) {
        final String username = rawUsername == null
                ? ""
                : rawUsername.trim().replaceFirst("^@", "");

        if (username.isEmpty()) {
            emitStatus("error", "", "Entre ton @username TikTok.", null);
            return;
        }

        stopConnectionOnly();

        activeUsername = username;
        smartMode = true;
        manualStop = false;
        connected = false;
        retryCount = 0;

        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        emitStatus(
                "launching",
                username,
                supportsPip()
                        ? "LIVE228 passe en mini-fenêtre puis ouvre TikTok. Démarre ton LIVE : la détection est automatique."
                        : "Picture-in-Picture non disponible sur ce téléphone. Ouverture de TikTok en mode compatibilité.",
                null
        );

        scheduleConnect(0);
        enterPipAndOpenTikTok();
    }

    private void enterPipAndOpenTikTok() {
        runOnUiThread(() -> {
            if (webView != null) {
                webView.evaluateJavascript(
                        "document.documentElement.classList.add('pip-mode');",
                        null
                );
            }

            if (supportsPip()) {
                try {
                    PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder()
                            .setAspectRatio(new Rational(9, 16));

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        builder.setSeamlessResizeEnabled(false);
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        builder.setTitle("LIVE228 Clash");
                        builder.setSubtitle("TikTok LIVE interactif");
                    }

                    setPictureInPictureParams(builder.build());
                    enterPictureInPictureMode(builder.build());
                } catch (Throwable ignored) {
                }
            }

            mainHandler.postDelayed(this::openTikTok, 350);
        });
    }

    private boolean supportsPip() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                && getPackageManager().hasSystemFeature("android.software.picture_in_picture");
    }

    @Override
    public void onUserLeaveHint() {
        super.onUserLeaveHint();
        if (!smartMode || !supportsPip() || isInPictureInPictureMode()) return;

        try {
            PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder()
                    .setAspectRatio(new Rational(9, 16));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                builder.setSeamlessResizeEnabled(false);
            }
            enterPictureInPictureMode(builder.build());
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);

        if (webView != null) {
            String script = isInPictureInPictureMode
                    ? "document.documentElement.classList.add('pip-mode');"
                    : "document.documentElement.classList.remove('pip-mode');";
            webView.evaluateJavascript(script, null);
        }
    }

    private void scheduleConnect(long delaySeconds) {
        if (!smartMode || manualStop || connected) return;
        if (!retryScheduled.compareAndSet(false, true)) return;

        liveExecutor.schedule(() -> {
            retryScheduled.set(false);
            attemptConnect();
        }, Math.max(0, delaySeconds), TimeUnit.SECONDS);
    }

    private void attemptConnect() {
        if (!smartMode || manualStop || connected) return;
        if (!connectAttemptRunning.compareAndSet(false, true)) return;

        retryCount++;
        emitStatus(
                "waiting",
                activeUsername,
                "Recherche du LIVE @" + activeUsername + "… essai " + retryCount
                        + ". Tu peux rester dans TikTok.",
                null
        );

        try {
            LiveClientBuilder builder = TikTokLive.newClient(activeUsername);

            builder.configure(settings -> {
                settings.setClientLanguage("fr");
                settings.setPrintToConsole(false);
                settings.setLogLevel(Level.WARNING);
                settings.setRetryOnConnectionFailure(false);
            });

            builder.onConnecting((client, event) ->
                    emitStatus("connecting", activeUsername, "TikTok répond, ouverture du flux LIVE…", null));

            builder.onConnected((client, event) -> {
                synchronized (clientLock) {
                    liveClient = client;
                }

                connected = true;
                connectAttemptRunning.set(false);
                retryCount = 0;

                Integer viewers = null;
                try {
                    viewers = client.getRoomInfo().getViewersCount();
                } catch (Throwable ignored) {
                }

                emitStatus(
                        "connected",
                        activeUsername,
                        "LIVE connecté. Likes, commentaires et cadeaux alimentent maintenant le jeu.",
                        viewers
                );
            });

            builder.onRoomInfo((client, event) ->
                    emitStatus("connected", activeUsername, null, event.getRoomInfo().getViewersCount()));

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

            builder.onLiveEnded((client, event) -> {
                connected = false;
                connectAttemptRunning.set(false);
                emitStatus("ended", activeUsername, "Le LIVE TikTok est terminé.", 0);
            });

            builder.onDisconnected((client, event) -> {
                connected = false;
                connectAttemptRunning.set(false);

                if (!manualStop && smartMode) {
                    emitStatus(
                            "reconnecting",
                            activeUsername,
                            "Connexion perdue. Reconnexion automatique…",
                            null
                    );
                    scheduleConnect(5);
                }
            });

            builder.onError((client, event) -> {
                if (!connected) {
                    connectAttemptRunning.set(false);
                    emitStatus(
                            "waiting",
                            activeUsername,
                            readableError(event.getException()),
                            null
                    );
                    scheduleConnect(nextRetryDelay());
                }
            });

            LiveClient client = builder.build();
            synchronized (clientLock) {
                liveClient = client;
            }
            client.connect();

        } catch (Throwable ex) {
            connected = false;
            connectAttemptRunning.set(false);
            safeDisconnectClient();

            emitStatus(
                    "waiting",
                    activeUsername,
                    readableError(ex),
                    null
            );
            scheduleConnect(nextRetryDelay());
        }
    }

    private long nextRetryDelay() {
        if (retryCount <= 4) return 4;
        if (retryCount <= 10) return 7;
        return 12;
    }

    private void stopSmartLive() {
        smartMode = false;
        manualStop = true;
        connected = false;
        retryScheduled.set(false);
        connectAttemptRunning.set(false);
        stopConnectionOnly();

        emitStatus(
                "disconnected",
                activeUsername,
                "LIVE228 arrêté.",
                null
        );
    }

    private void stopConnectionOnly() {
        safeDisconnectClient();
    }

    private void safeDisconnectClient() {
        LiveClient current;
        synchronized (clientLock) {
            current = liveClient;
            liveClient = null;
        }

        if (current != null) {
            try {
                current.disconnect();
            } catch (Throwable ignored) {
            }
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

        runOnUiThread(() -> {
            if (webView != null) {
                webView.evaluateJavascript(script, null);
            }
        });
    }

    private String readableError(Throwable ex) {
        if (ex == null) {
            return "En attente du LIVE TikTok…";
        }

        Throwable root = ex;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }

        String message = root.getMessage();
        if (message == null || message.trim().isEmpty()) {
            message = root.getClass().getSimpleName();
        }

        String lower = message.toLowerCase();
        if (lower.contains("offline")
                || lower.contains("not found")
                || lower.contains("unknown host")) {
            return "@" + activeUsername
                    + " n'est pas encore détecté en LIVE. Reste dans TikTok : LIVE228 réessaie automatiquement.";
        }

        return "TikTok LIVE : " + message;
    }

    private void openTikTok() {
        Intent launch = getPackageManager().getLaunchIntentForPackage("com.zhiliaoapp.musically");
        if (launch == null) {
            launch = getPackageManager().getLaunchIntentForPackage("com.ss.android.ugc.trill");
        }

        try {
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
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
        smartMode = false;
        manualStop = true;
        connected = false;
        safeDisconnectClient();
        liveExecutor.shutdownNow();

        if (webView != null) {
            webView.destroy();
            webView = null;
        }

        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (isInPictureInPictureMode()) {
            return;
        }

        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
