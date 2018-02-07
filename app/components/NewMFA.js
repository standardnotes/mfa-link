import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
import Util from "../lib/Util.js"
var QRCode = require('qrcode.react');

export default class NewMFA extends React.Component {

  constructor(props) {
    super(props);
    this.state = {secret: Util.generateSecretKey(), allowRecovery: true}
    setInterval(() => {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      var countDown = 30 - (epoch % 30);
      if (epoch % 30 == 0) this.forceUpdate();
    }, 100);
  }

  install = () => {
    this.setState({confirm: true});
  }

  cancelConfirmation = () => {
    this.setState({confirm: false});
  }

  confirmInstall = () => {
    BridgeManager.get().installMfa(this.state.secret, this.state.allowRecovery);
  }

  handleKeyInputChange = (event) => {
    this.setState({confirmKey: event.target.value});
  }

  handleTokenInputChange = (event) => {
    this.setState({confirmToken: event.target.value});
  }

  submitConfirmationForm = (event) => {
    event.preventDefault();
    let matchesKey = this.state.confirmKey == this.state.secret;
    let matchesToken = Util.getOtp(this.state.secret) == this.state.confirmToken;

    if(!matchesKey) {
      alert("The Secret Key you entered is incorrect. Please try again.");
    } else if(!matchesToken) {
      alert("The Current Token you entered is incorrect. Please try again.");
    } else {
      // Install
      this.confirmInstall();
    }
  }

  toggleEmailRecovery = () => {
    this.setState({allowRecovery: !this.state.allowRecovery})
  }

  recoveryLearnMore = () => {
    this.setState({showRecoveryDetails: !this.state.showRecoveryDetails});
  }

  render() {
    var secret = this.state.secret;
    var url = Util.generateQrCodeUrl(secret);
    var otp = Util.getOtp(secret);
    return [

      (this.state.confirm &&
        <div className="panel-section no-border no-bottom-pad">
          <div className="panel-row">
            <h1 className="title">
              Confirm 2FA
            </h1>
            <a onClick={this.cancelConfirmation} className="info">Cancel</a>
          </div>

          <div className="panel-row">
            <p>
            Ensure you have stored your <strong>Secret Key</strong> somewhere safe. If you lose this key, you lose access to your account.
            </p>
          </div>

          <form className="panel-row panel-form" onSubmit={this.submitConfirmationForm}>
            <div className="panel-column stretch">
              <input
                placeholder="Enter Secret Key"
                value={this.state.confirmKey}
                onChange={this.handleKeyInputChange}
              />
              <input
                placeholder="Enter Current Token"
                value={this.state.confirmToken}
                onChange={this.handleTokenInputChange}
              />

              <div className="panel-row center justify-left">
                <label>
                  <input checked={this.state.allowRecovery} onChange={this.toggleEmailRecovery} type="checkbox" />
                  Allow email recovery
                </label>
              </div>

              <div className="panel-row button-group stretch form-submit">
                <button className="button info featured" type="submit">
                  <div className="label">Install 2FA</div>
                </button>
              </div>

              <div className="panel-row"/>
              <div className="panel-row">
                <h1 className="title">
                  Email Recovery
                </h1>
              </div>

              <div className="panel-row">
                <div className="panel-column">
                  <p>
                  If you lose access to your device and your secret key, you will be unable to login to your account.
                  If you enable Email Recovery, you can email Standard Notes from your account email to disable 2FA
                  and allow you to sign back in to your account.
                  </p>
                  <br/>
                  <p>
                  If you leave this option unchecked, you will permanently lose access to your account if you lose your secret key and do not have it backed up.
                  For power users who maintain good data safety practices, we recommend keeping this option <i>disabled</i> for optimum security.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      ),

      (!this.state.confirm &&
        <div className="panel-section no-border no-bottom-pad">
          <p>
            2FA is currently disabled. You can enable 2FA by accepting the code below and pressing “Install”.
          </p>
        </div>
      ),

      (!this.state.confirm &&

        <div className="panel-section">
            <h1 className="panel-row outer-title"><strong>Enable two-factor authentication</strong></h1>

          <div className="panel-row justify-left align-top">

            <div className="panel-column">
              <QRCode value={url}/>
              <div className="panel-row button-group stretch">
                <div className="button info" onClick={this.install}>
                  <div className="label">Install</div>
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

              <h2 className="panel-row">Instructions (read very carefully):</h2>

              <ol>
                <li>
                  <p>Scan the QR code in your authenticator app.</p>
                </li>
                <li>
                  <p>Ensure you see the code <strong>{otp}</strong> generated by the app.</p>
                </li>
                <li>
                  <p>Save the <strong>Secret Key</strong> somewhere safe.</p>
                  <p><a href="https://standardnotes.org/help/21/where-should-i-store-my-two-factor-authentication-secret-key" target="_blank" className="info">Key Storage Recommendations</a></p>
                  <p>
                    <strong className="danger">Important: </strong>
                    Some apps, like Google Authenticator, do not back up and restore your secret keys if you lose your device or get a new one.
                    If you lose your Secret Key, you’ll be <strong className="danger">permanently locked out of your Standard Notes account.</strong>
                  </p>
                </li>
                <li>
                  <p>Press <i>Install</i>.</p>
                </li>
              </ol>

            </div>
          </div>
        </div>
      )
    ]
  }
}
