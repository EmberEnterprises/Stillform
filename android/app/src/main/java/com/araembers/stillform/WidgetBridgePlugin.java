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
    public void getWidgetAction(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences("stillform", android.content.Context.MODE_PRIVATE);
        String action = prefs.getString("widget_action", null);

        // Clear after reading
        if (action != null) {
            prefs.edit().remove("widget_action").apply();
        }

        JSObject ret = new JSObject();
        ret.put("action", action != null ? action : "none");
        call.resolve(ret);
    }
}
