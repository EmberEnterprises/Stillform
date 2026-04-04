package com.araembers.stillform;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WatchBridge")
public class WatchBridgePlugin extends Plugin {

    @PluginMethod()
    public void startBreathing(PluginCall call) {
        String pattern = call.getString("pattern", "calm");
        WatchBridge.startBreathingOnWatch(getContext(), pattern);
        call.resolve();
    }
}
