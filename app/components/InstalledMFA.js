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
    return (
      <div>
        <p>Your key: {secret}</p>
        <p>URL: {url}</p>
        <p>OTP: {otp}</p>
        <QRCode value={url}/>
        <div style={{marginTop: 10}}>
          <button onClick={this.uninstall}>Uninstall</button>
        </div>
      </div>
    )
  }

}
