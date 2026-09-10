/* Watch bridge JS side — pattern validation + silent degradation off-native. */
import assert from "node:assert";
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

// No Capacitor at all (web): must return false, never throw.
delete globalThis.window;
const wb = await import("../watchBridge.js");
ok("returns false on web (no Capacitor), never throws", () => {
  assert.strictEqual(wb.startBreathingOnWatch("deep-regulate"), false);
  assert.strictEqual(wb.isWatchBridgeAvailable(), false);
});
ok("invalid pattern still doesn't throw off-native", () => {
  assert.strictEqual(wb.startBreathingOnWatch("nonsense"), false);
});

// Simulate a native platform WITH the plugin: must dispatch with a valid id.
let sent = null;
globalThis.window = {
  Capacitor: {
    isNativePlatform: () => true,
    Plugins: { WatchBridge: { startBreathing: (arg) => { sent = arg; } } },
  },
};
const wb2 = await import("../watchBridge.js?native=1");
ok("dispatches a valid pattern on native", () => {
  sent = null;
  const r = wb2.startBreathingOnWatch("cyclic-sighing");
  assert.strictEqual(r, true);
  assert.deepStrictEqual(sent, { pattern: "cyclic-sighing" });
});
ok("coerces an invalid pattern to deep-regulate (never sends garbage to the watch)", () => {
  sent = null;
  wb2.startBreathingOnWatch("bogus");
  assert.deepStrictEqual(sent, { pattern: "deep-regulate" });
});
console.log(`watchBridge: ${n}/4 pass`);
