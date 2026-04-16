import UIKit
import Capacitor

@objc(AppViewController)
class AppViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        guard let bridge else { return }
        if bridge.plugin(withName: "IntegrationBridge") == nil {
            bridge.registerPluginInstance(IntegrationBridgePlugin())
        }
    }
}
