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
        handleWidgetAction(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleWidgetAction(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        handleWidgetAction(getIntent());
    }

    private void handleWidgetAction(Intent intent) {
        if (intent != null && intent.hasExtra("stillform_action")) {
            String action = intent.getStringExtra("stillform_action");
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                    "window.WIDGET_ACTION = '" + action.replace("'", "\\'") + "';",
                    null
                );
            });
        }
    }
}
