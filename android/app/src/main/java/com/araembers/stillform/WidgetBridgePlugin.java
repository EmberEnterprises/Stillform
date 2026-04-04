package com.araembers.stillform;

import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod()
    public void checkLaunchAction(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences("stillform_widget", android.content.Context.MODE_PRIVATE);
        boolean launchBreathe = prefs.getBoolean("launch_breathe", false);

        // Clear the flag after reading
        if (launchBreathe) {
            prefs.edit().putBoolean("launch_breathe", false).apply();
        }

        JSObject result = new JSObject();
        result.put("action", launchBreathe ? "breathe" : "none");
        call.resolve(result);
    }
}
