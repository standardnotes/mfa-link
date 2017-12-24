import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
var base32 = require("hi-base32");
var QRCode = require('qrcode.react');
import Util from "../lib/Util.js"

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    BridgeManager.get().initiateBridge();
  }

  generateSecretKey() {
    let str = this.random(10);
    var encoded = base32.encode(str);
    return encoded;
  }

  random(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  generateQrCodeUrl(secret) {
    return `otpauth://totp/2FA?secret=${secret}&issuer=Standard%20Notes`
  }

  render() {
    var secret = this.generateSecretKey();
    var url = this.generateQrCodeUrl(secret);
    var otp = Util.getOtp(secret);
    return (
      <div>
        <p>Your key: {secret}</p>
        <p>URL: {url}</p>
        <p>OTP: {otp}</p>
        <QRCode value={url}/>
      </div>
    )
  }

}
