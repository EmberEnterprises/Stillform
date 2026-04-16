import UIKit
import Capacitor

@objc(AppViewController)
class AppViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginType(IntegrationBridgePlugin.self)
    }
}
