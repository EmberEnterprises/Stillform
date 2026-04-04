package com.araembers.stillform;

import android.webkit.JavascriptInterface;

public class WidgetDataInterface {
    private String action;

    public WidgetDataInterface(String action) {
        this.action = action;
    }

    @JavascriptInterface
    public String getAction() {
        return action != null ? action : "";
    }
}
