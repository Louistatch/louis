package com.live228.clash;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String GAME_URL = "file:///android_asset/game/index.html";
    private static final int OVERLAY_REQUEST = 228;

    private WebView webView;
    private String pendingUsername = "";
    private boolean pendingSmartLaunch = false;

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
            stopService(new Intent(MainActivity.this, LiveOverlayService.class));
        }

        @JavascriptInterface
        public void openTikTok() {
            runOnUiThread(MainActivity.this::openTikTok);
        }

        @JavascriptInterface
        public boolean hasOverlayPermission() {
            return Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(MainActivity.this);
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

        pendingUsername = username;
        getSharedPreferences("live228", MODE_PRIVATE)
                .edit()
                .putString("username", username)
                .apply();

        runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
                pendingSmartLaunch = true;
                emitStatus(
                        "permission",
                        username,
                        "Autorise LIVE228 à s'afficher par-dessus TikTok. C'est ce qui évite de quitter le LIVE.",
                        null
                );
                Intent permissionIntent = new Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName())
                );
                startActivityForResult(permissionIntent, OVERLAY_REQUEST);
                return;
            }
            launchOverlayServiceAndTikTok(username);
        });
    }

    private void launchOverlayServiceAndTikTok(String username) {
        Intent serviceIntent = new Intent(this, LiveOverlayService.class);
        serviceIntent.setAction(LiveOverlayService.ACTION_START);
        serviceIntent.putExtra(LiveOverlayService.EXTRA_USERNAME, username);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }

        emitStatus(
                "launching",
                username,
                "LIVE228 reste actif en bulle. Démarre ton LIVE TikTok sans revenir ici.",
                null
        );

        openTikTok();
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (pendingSmartLaunch
                && !pendingUsername.isEmpty()
                && (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this))) {
            pendingSmartLaunch = false;
            launchOverlayServiceAndTikTok(pendingUsername);
        }
    }

    private void openTikTok() {
        Intent launch = getPackageManager().getLaunchIntentForPackage("com.zhiliaoapp.musically");
        if (launch == null) {
            launch = getPackageManager().getLaunchIntentForPackage("com.ss.android.ugc.trill");
        }

        try {
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(launch);
            } else {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.tiktok.com/")));
            }
        } catch (ActivityNotFoundException e) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.tiktok.com/")));
        }
    }

    private void emitStatus(String state, String username, String message, Integer viewers) {
        if (webView == null) return;

        String json = "{"
                + "\"state\":" + quote(state)
                + (username == null || username.isEmpty() ? "" : ",\"username\":" + quote(username))
                + (message == null || message.isEmpty() ? "" : ",\"message\":" + quote(message))
                + (viewers == null ? "" : ",\"viewers\":" + viewers)
                + "}";

        String script = "window.Live228NativeStatus && window.Live228NativeStatus(" + quote(json) + ");";
        runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    private static String quote(String value) {
        if (value == null) return "null";
        return "\"" + value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                + "\"";
    }

    @Override
    protected void onDestroy() {
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
