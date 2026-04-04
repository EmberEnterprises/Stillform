package com.araembers.stillform;

import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatchBridgePlugin.class);
        registerPlugin(WidgetBridgePlugin.class);
        Log.d("STILLFORM", "onCreate called");
        handleWidgetAction(getIntent());
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d("STILLFORM", "onNewIntent called");
        setIntent(intent);
        handleWidgetAction(intent);
    }

    private void handleWidgetAction(Intent intent) {
        Log.d("STILLFORM", "handleWidgetAction, hasExtra: " + (intent != null && intent.hasExtra("stillform_action")));
        if (intent != null && intent.hasExtra("stillform_action")) {
            String action = intent.getStringExtra("stillform_action");
            Log.d("STILLFORM", "Writing widget_action to SharedPreferences: " + action);
            getSharedPreferences("stillform", MODE_PRIVATE)
                .edit()
                .putString("widget_action", action)
                .commit();
        }
    }
}
