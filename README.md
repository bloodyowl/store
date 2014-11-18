# store

> a simple store that works well with Flux

[![Build Status](https://travis-ci.org/bloodyowl/store.svg)](https://travis-ci.org/bloodyowl/store)

## install

```sh
$ npm install bloody-store
```

## require

```javascript
var Store = require("bloody-store")
```

## api

### var store = new Store(spec)

base class for Stores, implementing the EventEmitter logic, Store instances must be have a `getStore` method

### store.addChangeListener(func)

adds a change listener to the store

### store.removeChangeListener(func)

removes a change listener to the store

### store.emitChange()

runs all the listeners that are currently in place in the order they've been added

### store.createReactMixin([spec])

returns a mixin that can be used by a React component, optionally merged with the spec

## example

```javascript
var AppDispatcher = require("../AppDispatcher")
var ActionTypes = require("../constants").ActionTypes
var Store = require("Store")

// where you hold your data
var _store = {}

var MyStore = new Store({
  // mandatory
  getStore() {
    return _store
  },

  dispatchToken : AppDispatcher.regiter(function(payload){
    var action = payload.action
    switch(action.type) {
      case ActionTypes.ADD_FOO:
        _store = Object.assign({}, _store, {foo : "bar"})
        MyStore.emitChange()
        break
      default:
        // do nothing
        break
    }
  })
})
```

and in your view

```javascript
var MyStore = require("../stores/MyStore")

React.createClass({
  mixins : [
    MyStore.createReactMixin()
  ]
})
```

## [license](LICENSE.md)
