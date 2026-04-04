package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private boolean widgetBreathe = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);

        // Check intent BEFORE super.onCreate loads WebView
        Intent intent = getIntent();
        if (intent != null && "breathe".equals(intent.getStringExtra("stillform_action"))) {
            widgetBreathe = true;
        }

        super.onCreate(savedInstanceState);

        if (widgetBreathe) {
            // WebView is now loaded — inject the flag and reload with it
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "try{localStorage.setItem('stillform_widget_breathe','true');window.location.replace(window.location.pathname)}catch(e){}",
                    null
                );
            });
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent != null && "breathe".equals(intent.getStringExtra("stillform_action"))) {
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "try{localStorage.setItem('stillform_widget_breathe','true');window.location.replace(window.location.pathname)}catch(e){}",
                    null
                );
            });
        }
    }
}
