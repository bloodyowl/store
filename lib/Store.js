!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Store=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var warn = require("./warn")
var mixinFactory = require("./mixinFactory")
var assign = require("object-assign")

/**
 * base class for Stores, implementing the EventEmitter logic,
 * Store instances must own a `getStore` method
 *
 * @param options {Object} Store methods and properties
 * @returns store {Object}
 */


  function Store(spec) {"use strict";
    if(typeof spec.getStore != "function") {
      throw new TypeError("missing `getStore` method")
    }
    assign(this, spec)
    this.$Store_listeners = []
  }

  /**
   * adds a change listener to the store
   *
   * @param func {Function} listener
   * @returns {Undefined}
   */
  Store.prototype.addChangeListener=function(func) {"use strict";
    warn(
      this.$Store_listeners.indexOf(func) == -1,
      "possible memory leak detected in %o",
      this
    )
    if(typeof func != "function") {
      throw new TypeError(
        "`func` should be a function, instead got " + typeof func
      )
    }
    this.$Store_listeners = this.$Store_listeners.concat(func)
  };

  /**
   * removes a change listener to the store
   *
   * @param func {Function} listener
   * @returns {Undefined}
   */
  Store.prototype.removeChangeListener=function(func) {"use strict";
    this.$Store_listeners = this.$Store_listeners.filter(
      function(listener)  {return listener !== func;}
    )
  };

  /**
   * runs all the listeners that are currently in place
   * in the order they've been added
   *
   * @returns {Undefined}
   */
  Store.prototype.emitChange=function() {"use strict";
    this.$Store_listeners.forEach(function(listener)  {return listener();})
  };

  /**
   * returns a mixin that can be used by a React component
   *
   * @param spec [optional] {Object}
   * @returns mixin {Object}
   */
  Store.prototype.createReactMixin=function(spec) {"use strict";
    var StoreMixin = mixinFactory(this)
    if(spec != null) {
      assign(StoreMixin, spec)
    }
    return StoreMixin
  };


module.exports = Store

},{"./mixinFactory":3,"./warn":4,"object-assign":2}],2:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var pendingException;
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}
	}

	if (pendingException) {
		throw pendingException;
	}

	return to;
};

},{}],3:[function(require,module,exports){
function mixinFactory(Store){
  var StoreMixin = {
    getInitialState:function() {
      return Store.getStore()
    },
    componentDidMount:function() {
      Store.addChangeListener(this._onStoreChange)
    },
    componentWillUnmount:function() {
      Store.removeChangeListener(this._onStoreChange)
    },
    _onStoreChange:function() {
      this.setState(Store.getStore())
    }
  }
  return StoreMixin
}

module.exports = mixinFactory

},{}],4:[function(require,module,exports){
/**
 * warns
 *
 * @param template {String}
 * @returns
 */
function warn(condition, template ){for (var replacements=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) replacements.push(arguments[$__0]);
  if(condition || !console || !console.warn) {
    return
  }
  console.warn.apply(console, [template].concat(replacements))
}

module.exports = warn

},{}]},{},[1])(1)
});