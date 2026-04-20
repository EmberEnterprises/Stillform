package com.araembers.stillform

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(WatchBridgePlugin::class.java)
        registerPlugin(WidgetBridgePlugin::class.java)
        registerPlugin(IntegrationBridgePlugin::class.java)
        Log.d("STILLFORM", "onCreate called")
        handleWidgetAction(intent)
        super.onCreate(savedInstanceState)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        Log.d("STILLFORM", "onNewIntent called")
        setIntent(intent)
        handleWidgetAction(intent)
    }

    private fun handleWidgetAction(intent: Intent?) {
        Log.d("STILLFORM", "handleWidgetAction, hasExtra: ${intent?.hasExtra("stillform_action")}")
        if (intent?.hasExtra("stillform_action") == true) {
            val action = intent.getStringExtra("stillform_action")
            Log.d("STILLFORM", "Writing widget_action to SharedPreferences: $action")
            getSharedPreferences("stillform", MODE_PRIVATE)
                .edit()
                .putString("widget_action", action)
                .commit()
        }
    }
}
