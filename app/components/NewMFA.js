import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
import Util from "../lib/Util.js"
var QRCode = require('qrcode.react');

export default class NewMFA extends React.Component {

  constructor(props) {
    super(props);
    this.state = {secret: Util.generateSecretKey()}
    setInterval(() => {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      var countDown = 30 - (epoch % 30);
      if (epoch % 30 == 0) this.forceUpdate();
    }, 100);
  }

  install = () => {
    BridgeManager.get().installMfa(this.state.secret);
  }

  render() {
    var secret = this.state.secret;
    var url = Util.generateQrCodeUrl(secret);
    var otp = Util.getOtp(secret);
    return (
      <div>
        <p>Your key: {secret}</p>
        <p>URL: {url}</p>
        <p>OTP: {otp}</p>
        <QRCode value={url}/>
        <div style={{marginTop: 10}}>
          <button onClick={this.install}>Install</button>
        </div>
      </div>
    )
  }

}
