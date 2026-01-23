'use strict';

class Channels extends EventTarget {
  constructor() {
    super();
    this._listeners = new WeakMap();
  }

  addListener(event, callback) {
    const wrappedCallback = (e) => {
      if (e.detail !== undefined) {
        callback(e.detail);
      } else {
        callback();
      }
    };
    
    this._listeners.set(callback, wrappedCallback);
    this.addEventListener(event, wrappedCallback);
  }

  removeListener(event, callback) {
    const wrappedCallback = this._listeners.get(callback);
    
    if (wrappedCallback) {
      this.removeEventListener(event, wrappedCallback);
      this._listeners.delete(callback);
    }
  }

  emit(event, data) {
    this.dispatchEvent(
      new CustomEvent(event, data !== undefined ? { detail: data } : {})
    );
  }

  on(event, callback) {
    this.addListener(event, callback);
  }

  off(event, callback) {
    this.removeListener(event, callback);
  }
}

const channels = new Channels();

export default channels;
