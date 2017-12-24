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

    this.componentManager = new ComponentManager(permissions, function(){
      console.log("Prolink Ready");
      // on ready
    });

    this.componentManager.streamItems(["SF|MFA"], (items) => {

    });


    console.log("Setting size.");
    this.componentManager.setSize("container", 500, 300);
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
