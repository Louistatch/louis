package com.live228.clash;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;

import io.github.jwdeveloper.tiktok.TikTokLive;
import io.github.jwdeveloper.tiktok.live.LiveClient;
import io.github.jwdeveloper.tiktok.live.builder.LiveClientBuilder;

public class LiveOverlayService extends Service {
    public static final String ACTION_START = "com.live228.clash.START_SMART_LIVE";
    public static final String EXTRA_USERNAME = "username";

    private static final String CHANNEL_ID = "live228_live";
    private static final int NOTIFICATION_ID = 228;
    private static final String GAME_URL = "file:///android_asset/game/index.html?overlay=1";

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean retryScheduled = new AtomicBoolean(false);
    private final Object clientLock = new Object();
    private final Deque<String> pendingScripts = new ArrayDeque<>();

    private WindowManager windowManager;
    private View bubbleView;
    private WindowManager.LayoutParams bubbleParams;
    private FrameLayout gameRoot;
    private WindowManager.LayoutParams gameParams;
    private WebView gameWebView;

    private volatile boolean running = false;
    private volatile boolean connected = false;
    private volatile boolean connecting = false;
    private volatile boolean pageReady = false;
    private volatile boolean manualStop = false;

    private LiveClient liveClient;
    private String username = "";
    private int retryCount = 0;
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        createNotificationChannel();

        PowerManager power = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "LIVE228:LiveEngine");
        wakeLock.setReferenceCounted(false);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String incoming = intent == null ? null : intent.getStringExtra(EXTRA_USERNAME);
        if (incoming == null || incoming.trim().isEmpty()) {
            incoming = getSharedPreferences("live228", MODE_PRIVATE).getString("username", "");
        }

        username = incoming == null ? "" : incoming.trim().replaceFirst("^@", "");
        if (username.isEmpty()) {
            stopSelf();
            return START_NOT_STICKY;
        }

        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        startForeground(NOTIFICATION_ID, buildNotification("Préparation de @" + username));

        if (!Settings.canDrawOverlays(this)) {
            updateNotification("Autorisation d'affichage manquante");
            stopSelf();
            return START_NOT_STICKY;
        }

        if (!wakeLock.isHeld()) {
            try {
                wakeLock.acquire(4 * 60 * 60 * 1000L);
            } catch (Throwable ignored) {
            }
        }

        if (!running) {
            running = true;
            manualStop = false;
            mainHandler.post(this::showWaitingBubble);
            scheduleConnect(0);
        }

        return START_STICKY;
    }

    private void scheduleConnect(long delaySeconds) {
        if (!running || manualStop || connected) return;
        if (!retryScheduled.compareAndSet(false, true)) return;

        executor.schedule(() -> {
            retryScheduled.set(false);
            attemptConnect();
        }, Math.max(0, delaySeconds), TimeUnit.SECONDS);
    }

    private void attemptConnect() {
        if (!running || manualStop || connected || connecting) return;

        connecting = true;
        retryCount++;
        setBubbleText("⏳ LIVE228 · attente LIVE");
        updateNotification("Recherche du LIVE @" + username + " · essai " + retryCount);
        emitStatus("connecting", "Recherche du LIVE @" + username + "…", null);

        try {
            LiveClientBuilder builder = TikTokLive.newClient(username);

            builder.configure(settings -> {
                settings.setClientLanguage("fr");
                settings.setPrintToConsole(false);
                settings.setLogLevel(Level.WARNING);
                settings.setRetryOnConnectionFailure(false);
            });

            builder.onConnected((client, event) -> {
                synchronized (clientLock) {
                    liveClient = client;
                }
                connected = true;
                connecting = false;
                retryCount = 0;

                Integer viewers = null;
                try {
                    viewers = client.getRoomInfo().getViewersCount();
                } catch (Throwable ignored) {
                }

                setBubbleText("🟢 LIVE228 · connecté");
                updateNotification("Connecté à @" + username);
                emitStatus("connected", "LIVE connecté. Le jeu va s'afficher sans quitter TikTok.", viewers);

                mainHandler.postDelayed(this::expandGameOverlay, 900);
            });

            builder.onRoomInfo((client, event) -> {
                emitStatus("connected", null, event.getRoomInfo().getViewersCount());
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

            builder.onLiveEnded((client, event) -> {
                connected = false;
                connecting = false;
                setBubbleText("⚫ LIVE228 · LIVE terminé");
                updateNotification("LIVE terminé");
                emitStatus("ended", "Le LIVE TikTok est terminé.", 0);
                collapseGameOverlay();
            });

            builder.onDisconnected((client, event) -> {
                connected = false;
                connecting = false;
                if (!manualStop && running) {
                    setBubbleText("🟠 LIVE228 · reconnexion");
                    emitStatus("reconnecting", "Connexion perdue, reconnexion automatique…", null);
                    scheduleConnect(5);
                }
            });

            builder.onError((client, event) -> {
                if (!connected) {
                    connecting = false;
                    String message = readableError(event.getException());
                    emitStatus("waiting", message, null);
                    setBubbleText("⏳ LIVE228 · démarre le LIVE");
                    scheduleConnect(nextRetryDelay());
                }
            });

            LiveClient client = builder.build();
            synchronized (clientLock) {
                liveClient = client;
            }
            client.connect();

        } catch (Throwable ex) {
            connecting = false;
            connected = false;
            safeDisconnectClient();

            String message = readableError(ex);
            emitStatus("waiting", message, null);
            setBubbleText("⏳ LIVE228 · démarre le LIVE");
            updateNotification("En attente du LIVE @" + username);
            scheduleConnect(nextRetryDelay());
        }
    }

    private long nextRetryDelay() {
        if (retryCount <= 4) return 4;
        if (retryCount <= 10) return 7;
        return 12;
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
            return "@" + username + " n'est pas encore détecté en LIVE. Reste sur TikTok : LIVE228 réessaie automatiquement.";
        }

        return "TikTok LIVE : " + message;
    }

    private int overlayType() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        }
        return WindowManager.LayoutParams.TYPE_PHONE;
    }

    private GradientDrawable roundedBackground(int color, float radiusDp) {
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(color);
        bg.setCornerRadius(dp(radiusDp));
        bg.setStroke(dp(1), 0x5537F1E8);
        return bg;
    }

    private void showWaitingBubble() {
        if (bubbleView != null || !Settings.canDrawOverlays(this)) return;

        TextView bubble = new TextView(this);
        bubble.setText("⏳ LIVE228 · démarre le LIVE");
        bubble.setTextColor(Color.WHITE);
        bubble.setTextSize(12);
        bubble.setGravity(Gravity.CENTER);
        bubble.setPadding(dp(13), dp(8), dp(13), dp(8));
        bubble.setBackground(roundedBackground(0xED0B1727, 18));

        bubbleParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                overlayType(),
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
        );
        bubbleParams.gravity = Gravity.TOP | Gravity.END;
        bubbleParams.x = dp(10);
        bubbleParams.y = dp(130);

        final float[] down = new float[2];
        final int[] start = new int[2];
        bubble.setOnTouchListener((v, event) -> {
            switch (event.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    down[0] = event.getRawX();
                    down[1] = event.getRawY();
                    start[0] = bubbleParams.x;
                    start[1] = bubbleParams.y;
                    return true;
                case MotionEvent.ACTION_MOVE:
                    bubbleParams.x = Math.max(0, start[0] - (int) (event.getRawX() - down[0]));
                    bubbleParams.y = Math.max(0, start[1] + (int) (event.getRawY() - down[1]));
                    try {
                        windowManager.updateViewLayout(bubble, bubbleParams);
                    } catch (Throwable ignored) {
                    }
                    return true;
                case MotionEvent.ACTION_UP:
                    float distance = Math.abs(event.getRawX() - down[0]) + Math.abs(event.getRawY() - down[1]);
                    if (distance < dp(10)) {
                        expandGameOverlay();
                    }
                    return true;
                default:
                    return false;
            }
        });

        try {
            windowManager.addView(bubble, bubbleParams);
            bubbleView = bubble;
        } catch (Throwable ignored) {
        }
    }

    private void setBubbleText(String text) {
        mainHandler.post(() -> {
            if (bubbleView instanceof TextView) {
                ((TextView) bubbleView).setText(text);
            }
        });
    }

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    private void expandGameOverlay() {
        if (!running || !Settings.canDrawOverlays(this)) return;

        mainHandler.post(() -> {
            if (gameRoot != null) return;

            pageReady = false;

            FrameLayout root = new FrameLayout(this);
            root.setBackgroundColor(Color.BLACK);

            WebView web = new WebView(this);
            web.setBackgroundColor(Color.BLACK);
            WebSettings settings = web.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setAllowContentAccess(true);
            settings.setAllowFileAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);

            web.addJavascriptInterface(new OverlayBridge(), "AndroidLive");
            web.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    pageReady = true;
                    view.evaluateJavascript(
                            "document.documentElement.classList.add('obs-mode');" +
                                    "document.body.style.overscrollBehavior='none';",
                            null
                    );

                    emitStatus(
                            connected ? "connected" : "waiting",
                            connected
                                    ? "LIVE connecté. Appuie sur — pour revenir à TikTok sans couper le LIVE."
                                    : "Jeu ouvert. LIVE228 continue de chercher le LIVE en arrière-plan.",
                            null
                    );
                    flushPendingScripts();
                }
            });

            root.addView(
                    web,
                    new FrameLayout.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.MATCH_PARENT
                    )
            );

            LinearLayout controls = new LinearLayout(this);
            controls.setOrientation(LinearLayout.HORIZONTAL);
            controls.setGravity(Gravity.CENTER_VERTICAL);
            controls.setPadding(dp(4), dp(4), dp(4), dp(4));
            controls.setBackground(roundedBackground(0xCC08111E, 18));

            Button collapse = overlayButton("—");
            collapse.setContentDescription("Réduire LIVE228");
            collapse.setOnClickListener(v -> collapseGameOverlay());

            Button stop = overlayButton("×");
            stop.setContentDescription("Arrêter LIVE228");
            stop.setOnClickListener(v -> stopSelf());

            controls.addView(collapse, new LinearLayout.LayoutParams(dp(48), dp(42)));
            controls.addView(stop, new LinearLayout.LayoutParams(dp(48), dp(42)));

            FrameLayout.LayoutParams controlsLp = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    Gravity.TOP | Gravity.END
            );
            controlsLp.topMargin = dp(8);
            controlsLp.rightMargin = dp(8);
            root.addView(controls, controlsLp);

            gameParams = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
                    overlayType(),
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                    PixelFormat.TRANSLUCENT
            );
            gameParams.gravity = Gravity.TOP | Gravity.START;
            gameParams.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;

            try {
                windowManager.addView(root, gameParams);
                gameRoot = root;
                gameWebView = web;
                if (bubbleView != null) {
                    windowManager.removeView(bubbleView);
                    bubbleView = null;
                }
                web.loadUrl(GAME_URL);
            } catch (Throwable ex) {
                gameRoot = null;
                gameWebView = null;
                pageReady = false;
                try {
                    web.destroy();
                } catch (Throwable ignored) {
                }
                showWaitingBubble();
            }
        });
    }

    private Button overlayButton(String label) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextColor(Color.WHITE);
        button.setTextSize(18);
        button.setAllCaps(false);
        button.setBackgroundColor(Color.TRANSPARENT);
        return button;
    }

    private void collapseGameOverlay() {
        mainHandler.post(() -> {
            pageReady = false;
            if (gameRoot != null) {
                try {
                    windowManager.removeView(gameRoot);
                } catch (Throwable ignored) {
                }
            }

            if (gameWebView != null) {
                try {
                    gameWebView.destroy();
                } catch (Throwable ignored) {
                }
            }

            gameRoot = null;
            gameWebView = null;
            showWaitingBubble();
            setBubbleText(connected ? "🟢 LIVE228 · toucher pour afficher" : "⏳ LIVE228 · attente LIVE");
        });
    }

    public final class OverlayBridge {
        @JavascriptInterface
        public void connect(String newUsername) {
            restartForUsername(newUsername);
        }

        @JavascriptInterface
        public void startSmartLive(String newUsername) {
            restartForUsername(newUsername);
        }

        @JavascriptInterface
        public void disconnect() {
            stopSelf();
        }

        @JavascriptInterface
        public void collapseOverlay() {
            collapseGameOverlay();
        }

        @JavascriptInterface
        public void openTikTok() {
            mainHandler.post(() -> {
                collapseGameOverlay();
                openTikTok();
            });
        }

        @JavascriptInterface
        public boolean hasOverlayPermission() {
            return true;
        }
    }

    private void restartForUsername(String raw) {
        String clean = raw == null ? "" : raw.trim().replaceFirst("^@", "");
        if (clean.isEmpty()) return;

        username = clean;
        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        connected = false;
        connecting = false;
        retryCount = 0;
        safeDisconnectClient();
        scheduleConnect(0);
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

            sendToGame("Live228NativeEvent", event);
        } catch (JSONException ignored) {
        }
    }

    private void emitStatus(String state, String message, Integer viewers) {
        try {
            JSONObject status = new JSONObject();
            status.put("state", state);
            status.put("username", username);
            if (message != null && !message.isEmpty()) status.put("message", message);
            if (viewers != null) status.put("viewers", viewers);
            sendToGame("Live228NativeStatus", status);
        } catch (JSONException ignored) {
        }
    }

    private void sendToGame(String function, JSONObject payload) {
        final String script = "window." + function + " && window." + function + "("
                + JSONObject.quote(payload.toString()) + ");";

        mainHandler.post(() -> {
            if (gameWebView != null && pageReady) {
                gameWebView.evaluateJavascript(script, null);
            } else {
                synchronized (pendingScripts) {
                    while (pendingScripts.size() >= 120) pendingScripts.removeFirst();
                    pendingScripts.addLast(script);
                }
            }
        });
    }

    private void flushPendingScripts() {
        if (gameWebView == null || !pageReady) return;

        synchronized (pendingScripts) {
            while (!pendingScripts.isEmpty()) {
                gameWebView.evaluateJavascript(pendingScripts.removeFirst(), null);
            }
        }
    }

    private void openTikTok() {
        Intent launch = getPackageManager().getLaunchIntentForPackage("com.zhiliaoapp.musically");
        if (launch == null) {
            launch = getPackageManager().getLaunchIntentForPackage("com.ss.android.ugc.trill");
        }

        try {
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                startActivity(launch);
            } else {
                Intent browser = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse("https://www.tiktok.com/"));
                browser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(browser);
            }
        } catch (Throwable ignored) {
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "LIVE228 TikTok",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Maintient le moteur LIVE228 actif pendant TikTok LIVE.");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private Notification buildNotification(String text) {
        Intent launch = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                228,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);

        return builder
                .setContentTitle("LIVE228 Clash")
                .setContentText(text)
                .setSmallIcon(android.R.drawable.presence_online)
                .setOngoing(true)
                .setContentIntent(pendingIntent)
                .build();
    }

    private void updateNotification(String text) {
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(NOTIFICATION_ID, buildNotification(text));
        }
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    public void onDestroy() {
        manualStop = true;
        running = false;
        connected = false;
        connecting = false;
        retryScheduled.set(false);

        safeDisconnectClient();
        executor.shutdownNow();

        mainHandler.post(() -> {
            if (bubbleView != null) {
                try {
                    windowManager.removeView(bubbleView);
                } catch (Throwable ignored) {
                }
                bubbleView = null;
            }

            if (gameRoot != null) {
                try {
                    windowManager.removeView(gameRoot);
                } catch (Throwable ignored) {
                }
                gameRoot = null;
            }

            if (gameWebView != null) {
                try {
                    gameWebView.destroy();
                } catch (Throwable ignored) {
                }
                gameWebView = null;
            }
        });

        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Throwable ignored) {
            }
        }

        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
