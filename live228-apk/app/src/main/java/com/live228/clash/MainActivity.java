package com.live228.clash;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final String GAME_URL = "http://127.0.0.1:2280/";
    private WebView webView;
    private TextView status;
    private boolean fallbackShown = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        buildUi();
        loadGame();
    }

    private void buildUi() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.BLACK);

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        webView.setBackgroundColor(Color.BLACK);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("live228".equals(uri.getScheme()) && "tiktok".equals(uri.getHost())) {
                    openTikTok();
                    return true;
                }
                if ("http".equals(uri.getScheme()) && "127.0.0.1".equals(uri.getHost())) {
                    return false;
                }
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (url.startsWith(GAME_URL)) {
                    fallbackShown = false;
                    setStatus("● MOTEUR CONNECTÉ", 0xFF44DD88);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame() && !fallbackShown) {
                    showFallback();
                }
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(dp(10), dp(6), dp(8), dp(6));
        bar.setBackgroundColor(0xD9151515);

        TextView title = new TextView(this);
        title.setText("🇹🇬 LIVE228");
        title.setTextColor(Color.WHITE);
        title.setTextSize(16);
        title.setTypeface(null, 1);

        status = new TextView(this);
        status.setText("● CONNEXION…");
        status.setTextColor(0xFFFFC857);
        status.setTextSize(11);
        status.setPadding(dp(10), 0, 0, 0);

        Button refresh = compactButton("↻");
        refresh.setOnClickListener(v -> loadGame());

        Button tiktok = compactButton("TikTok");
        tiktok.setOnClickListener(v -> openTikTok());

        LinearLayout.LayoutParams titleLp = new LinearLayout.LayoutParams(0, dp(42), 1f);
        bar.addView(title, titleLp);
        bar.addView(status, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, dp(42)));
        bar.addView(refresh, new LinearLayout.LayoutParams(dp(46), dp(42)));
        bar.addView(tiktok, new LinearLayout.LayoutParams(dp(82), dp(42)));

        FrameLayout.LayoutParams barLp = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, dp(54), Gravity.TOP);
        root.addView(bar, barLp);

        webView.setPadding(0, dp(54), 0, 0);
        setContentView(root);
    }

    private Button compactButton(String text) {
        Button b = new Button(this);
        b.setText(text);
        b.setTextColor(Color.WHITE);
        b.setTextSize(12);
        b.setAllCaps(false);
        b.setBackgroundColor(0xFF2A2A2A);
        return b;
    }

    private void loadGame() {
        fallbackShown = false;
        setStatus("● CONNEXION…", 0xFFFFC857);
        webView.loadUrl(GAME_URL);
    }

    private void showFallback() {
        fallbackShown = true;
        setStatus("● MOTEUR ARRÊTÉ", 0xFFFF6666);
        webView.loadUrl("file:///android_asset/offline.html");
    }

    private void setStatus(String text, int color) {
        runOnUiThread(() -> {
            status.setText(text);
            status.setTextColor(color);
        });
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

    private int dp(int value) {
        float density = getResources().getDisplayMetrics().density;
        return (int) (value * density + 0.5f);
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
