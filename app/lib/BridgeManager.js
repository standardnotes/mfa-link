import ComponentManager from 'sn-components-api';

export default class BridgeManager {

  /* Singleton */
  static instance = null;
  static get() {
    if (this.instance == null) { this.instance = new BridgeManager(); }
    return this.instance;
  }

  constructor(onReceieveItems) {
    this.updateObservers = [];
    this.items = [];
  }

  initiateBridge() {
    var permissions = [
      {
        // name: "stream-context-item"
        name: "stream-items",
        content_types: ["SF|MFA"]
      }
    ]

    this.componentManager = new ComponentManager(permissions, () => {
      console.log("GoogleAuth Ready");
      console.log("Setting size.");
      this.componentManager.setSize("container", 500, 300);
      // on ready
    });

    this.componentManager.streamItems(["SF|MFA"], (items) => {
      for(var item of items) {
        if(item.deleted) {
          this.items.splice(this.items.indexOf(this.itemForId(item.uuid)), 1);
          continue;
        }
        if(item.isMetadataUpdate) { continue; }
        var index = this.items.indexOf(item);
        if(index >= 0) {
          this.items[index] = item;
        } else {
          this.items.push(item);
        }
      }

      for(var observer of this.updateObservers) {
        observer.callback();
      }
    });
  }

  getInstalledMfa() {
    return this.items[0];
  }

  itemForId(uuid) {
    return this.items.filter((item) => {return item.uuid == uuid})[0];
  }

  installMfa(secret) {
    console.log("Installing mfa", secret);
    this.componentManager.createItem({
      content_type: "SF|MFA",
      content: {
        name: "Google Authenticator",
        secret: secret
      }
    }, (item) => {
      console.log("GA created item", item);
    });
  }

  uninstallMfa(mfa) {
    this.componentManager.deleteItem(mfa);
  }

  addUpdateObserver(callback) {
    let observer = {id: Math.random, callback: callback};
    this.updateObservers.push(observer);
    return observer;
  }

  removeUpdateObserver(observer) {
    this.updateObservers.splice(this.updateObservers.indexOf(observer), 1);
  }


}
