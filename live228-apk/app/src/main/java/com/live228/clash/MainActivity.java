package com.live228.clash;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
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

    private WebView webView;
    private LiveClient liveClient;

    private volatile boolean mobileGamingMode = false;
    private volatile boolean connected = false;
    private volatile boolean manualStop = false;
    private volatile boolean leftForTikTok = false;
    private volatile int retryCount = 0;
    private String activeUsername = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        activeUsername = getSharedPreferences("live228", MODE_PRIVATE)
                .getString("username", "");
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
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                if (!activeUsername.isEmpty()) {
                    String script = "var x=document.getElementById('tiktokUsername');"
                            + "if(x && !x.value)x.value=" + JSONObject.quote("@" + activeUsername) + ";";
                    view.evaluateJavascript(script, null);
                }
            }
        });

        setContentView(webView);
        webView.loadUrl(GAME_URL);
    }

    public final class AndroidLiveBridge {
        @JavascriptInterface
        public void prepareMobileLive(String username) {
            MainActivity.this.prepareMobileLive(username);
        }

        @JavascriptInterface
        public void connect(String username) {
            MainActivity.this.startAutoConnect(username);
        }

        @JavascriptInterface
        public void disconnect() {
            MainActivity.this.stopLiveEngine();
        }

        @JavascriptInterface
        public void openTikTok() {
            runOnUiThread(MainActivity.this::openTikTok);
        }
    }

    private String cleanUsername(String raw) {
        return raw == null ? "" : raw.trim().replaceFirst("^@", "");
    }

    private void prepareMobileLive(String rawUsername) {
        String username = cleanUsername(rawUsername);
        if (username.isEmpty()) {
            emitStatus("error", "", "Entre ton @username TikTok.", null);
            return;
        }

        activeUsername = username;
        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        manualStop = false;
        mobileGamingMode = true;
        leftForTikTok = true;

        emitStatus(
                "prepared",
                username,
                "Dans TikTok, choisis LIVE > Mobile Gaming/partage d'écran, démarre le LIVE, puis reviens à LIVE228 avec le bouton Applications récentes — pas avec Retour.",
                null
        );

        runOnUiThread(this::openTikTok);
    }

    private void startAutoConnect(String rawUsername) {
        String username = cleanUsername(rawUsername);
        if (username.isEmpty()) {
            username = activeUsername;
        }
        if (username == null || username.isEmpty()) {
            emitStatus("error", "", "Entre ton @username TikTok.", null);
            return;
        }

        activeUsername = username;
        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        manualStop = false;
        mobileGamingMode = true;
        connected = false;
        retryCount = 0;

        safeDisconnectClient();
        scheduleConnect(0);
        enableImmersive();
    }

    private void scheduleConnect(long delaySeconds) {
        if (manualStop || connected || activeUsername.isEmpty()) return;
        if (!retryScheduled.compareAndSet(false, true)) return;

        liveExecutor.schedule(() -> {
            retryScheduled.set(false);
            attemptConnect();
        }, Math.max(0, delaySeconds), TimeUnit.SECONDS);
    }

    private void attemptConnect() {
        if (manualStop || connected || activeUsername.isEmpty()) return;
        if (!connectAttemptRunning.compareAndSet(false, true)) return;

        retryCount++;
        emitStatus(
                "waiting",
                activeUsername,
                "Recherche du LIVE @" + activeUsername + "… essai " + retryCount
                        + ". Reste dans LIVE228 : TikTok continue de diffuser l'écran.",
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
                    emitStatus("connecting", activeUsername, "TikTok répond, connexion au flux LIVE…", null));

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
                        "LIVE connecté. L'écran du jeu est diffusé et les interactions pilotent la partie.",
                        viewers
                );
                enableImmersive();
            });

            builder.onRoomInfo((client, event) -> {
                int viewers = event.getRoomInfo().getViewersCount();
                emitStatus("connected", activeUsername, null, viewers);
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
                    emitStatus("reconnecting", activeUsername, "Reconnexion automatique…", null));

            builder.onLiveEnded((client, event) -> {
                connected = false;
                mobileGamingMode = false;
                connectAttemptRunning.set(false);
                emitStatus("ended", activeUsername, "Le LIVE TikTok est terminé.", 0);
                disableImmersive();
            });

            builder.onDisconnected((client, event) -> {
                connected = false;
                connectAttemptRunning.set(false);
                if (!manualStop && mobileGamingMode) {
                    emitStatus("reconnecting", activeUsername, "Connexion perdue — nouvel essai automatique…", null);
                    scheduleConnect(5);
                }
            });

            builder.onError((client, event) -> {
                if (!connected) {
                    connectAttemptRunning.set(false);
                    emitStatus("waiting", activeUsername, readableError(event.getException()), null);
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
            emitStatus("waiting", activeUsername, readableError(ex), null);
            scheduleConnect(nextRetryDelay());
        }
    }

    private long nextRetryDelay() {
        if (retryCount <= 4) return 4;
        if (retryCount <= 10) return 7;
        return 12;
    }

    private void stopLiveEngine() {
        manualStop = true;
        mobileGamingMode = false;
        connected = false;
        retryScheduled.set(false);
        connectAttemptRunning.set(false);
        safeDisconnectClient();
        emitStatus("disconnected", activeUsername, "LIVE228 arrêté.", null);
        disableImmersive();
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

    private void emitStatus(String state, String username, String message, Integer viewers) {
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
            if (webView != null) webView.evaluateJavascript(script, null);
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
        if (lower.contains("offline") || lower.contains("not found") || lower.contains("unknown host")) {
            return "@" + activeUsername
                    + " n'est pas encore détecté en LIVE. LIVE228 réessaie automatiquement.";
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

    private void enableImmersive() {
        runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = getWindow().getInsetsController();
                if (controller != null) {
                    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(
                            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    );
                }
            } else {
                getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                );
            }
        });
    }

    private void disableImmersive() {
        runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = getWindow().getInsetsController();
                if (controller != null) {
                    controller.show(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                }
            } else {
                getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (leftForTikTok && mobileGamingMode && !activeUsername.isEmpty()) {
            leftForTikTok = false;
            enableImmersive();
            startAutoConnect(activeUsername);
        }
    }

    @Override
    protected void onDestroy() {
        manualStop = true;
        mobileGamingMode = false;
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
        if (mobileGamingMode) {
            return;
        }
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
