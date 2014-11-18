var warn = require("./warn")
var mixinFactory = require("./mixinFactory")
var assign = require("object-assign")

/**
 * base class for Stores, implementing the EventEmitter logic,
 * Store instances must be have a `getStore` method
 *
 * @param options {Object} Store methods and properties
 * @returns store {Object}
 */
class Store {

  constructor(spec) {
    if(typeof spec.getStore != "function") {
      throw new TypeError("missing `getStore` method")
    }
    assign(this, spec)
    this._listeners = []
  }

  /**
   * adds a change listener to the store
   *
   * @param func {Function} listener
   * @returns {Undefined}
   */
  addChangeListener(func) {
    warn(
      this._listeners.indexOf(func) == -1,
      "possible memory leak detected in %o",
      this
    )
    if(typeof func != "function") {
      throw new TypeError(
        "`func` should be a function, instead got " + typeof func
      )
    }
    this._listeners = this._listeners.concat(func)
  }

  /**
   * removes a change listener to the store
   *
   * @param func {Function} listener
   * @returns {Undefined}
   */
  removeChangeListener(func) {
    this._listeners = this._listeners.filter(
      (listener) => listener !== func
    )
  }

  /**
   * runs all the listeners that are currently in place
   * in the order they've been added
   *
   * @returns {Undefined}
   */
  emitChange() {
    this._listeners.forEach((listener) => listener())
  }

  /**
   * returns a mixin that can be used by a React component
   *
   * @param spec [optional] {Object}
   * @returns mixin {Object}
   */
  createReactMixin(spec) {
    var StoreMixin = mixinFactory(this)
    if(spec != null) {
      assign(StoreMixin, spec)
    }
    return StoreMixin
  }
}

module.exports = Store
