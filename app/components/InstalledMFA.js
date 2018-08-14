import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
var QRCode = require('qrcode.react');
import Util from "../lib/Util.js"

export default class InstalledMFA extends React.Component {

  constructor(props) {
    super(props);
    setInterval(() => {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      var countDown = 30 - (epoch % 30);
      if (epoch % 30 == 0) this.forceUpdate();
    }, 100);
  }

  uninstall = () => {
    BridgeManager.get().uninstallMfa(this.props.mfa);
  }

  render() {
    var secret = this.props.mfa.content.secret;
    var url = Util.generateQrCodeUrl(secret);
    var otp = Util.getOtp(secret);
    return [
      <div className="panel-section no-border no-bottom-pad">
        <p>
          2FA is enabled. You can disable 2FA by pressing Disable below.
        </p>
      </div>,
      <div className="panel-section">
          <h1 className="panel-row outer-title"><strong>Two-factor Authentication</strong></h1>

        <div className="panel-row justify-left align-top">

          <div className="panel-column">
            <QRCode value={url}/>
            <div className="panel-row button-group stretch">
              <div className="button danger" onClick={this.uninstall}>
                <div className="label">Disable</div>
              </div>
            </div>
          </div>

          <div className="panel-column right-section">

            <p className="panel-row justify-left multi-label">
              Secret Key
              <strong>{secret}</strong>
            </p>
            <p className="panel-row justify-left multi-label">
              Current Token
              <strong>{otp}</strong>
            </p>

            <p className="panel-row justify-left multi-label">
              Email Recovery
              <strong>{this.props.mfa.content.allowEmailRecovery ? "Enabled" : "Disabled"}</strong>
            </p>

          </div>
        </div>
      </div>
    ]
  }

}
