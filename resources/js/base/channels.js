'use strict';

class Channels extends EventTarget {
  constructor() {
    super();
    // event -> WeakMap(callback -> wrapped), so one callback can listen to several events
    this._listeners = new Map();
  }

  addListener(event, callback) {
    const wrappedCallback = (e) => {
      if (e.detail !== undefined) {
        callback(e.detail);
      } else {
        callback();
      }
    };

    if (!this._listeners.has(event)) {
      this._listeners.set(event, new WeakMap());
    }
    this._listeners.get(event).set(callback, wrappedCallback);
    this.addEventListener(event, wrappedCallback);
  }

  removeListener(event, callback) {
    const wrappedCallback = this._listeners.get(event)?.get(callback);

    if (wrappedCallback) {
      this.removeEventListener(event, wrappedCallback);
      this._listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    this.dispatchEvent(
      new CustomEvent(event, data !== undefined ? { detail: data } : {}),
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
