package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);
        super.onCreate(savedInstanceState);

        // Inject widget action into WebView's global scope
        String action = getIntent() != null ? getIntent().getStringExtra("stillform_action") : null;
        getBridge().getWebView().addJavascriptInterface(
            new WidgetDataInterface(action), "StillformWidget"
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        String action = intent != null ? intent.getStringExtra("stillform_action") : null;
        if ("breathe".equals(action)) {
            getBridge().getWebView().addJavascriptInterface(
                new WidgetDataInterface(action), "StillformWidget"
            );
            // Reload to pick up the new action
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "window.location.reload();", null
                );
            });
        }
    }
}
