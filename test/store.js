var tape = require("tape")
var Store = require("../src")

tape("Store", function(test){
  var store = new Store({
    getStore(){}
  })
  test.equal(
    Object.prototype.toString.call(store),
    "[object Object]",
    "is an object"
  )
  test.throws(
    function(){
      new Store()
    },
    "throws if not specs are passed"
  )
  test.throws(
    function(){
      new Store({})
    },
    "throws if `getStore` method is passed"
  )
  test.end()
})

tape("Store change event", function(test){
  var store = new Store({
    getStore(){}
  })
  var listener = function(){
    test.pass("executed callback")
    test.end()
  }
  store.addChangeListener(listener)
  store.emitChange(listener)
})

tape("Store removes change event", function(test){
  var store = new Store({
    getStore(){}
  })
  var executions = 0
  var listener = function(){
    ++executions
  }
  store.addChangeListener(listener)
  store.removeChangeListener(listener)
  store.emitChange(listener)
  test.equal(executions, 0, "removes change listener")
  test.end()
})

tape("Store removes change event", function(test){
  var store = new Store({
    getStore(){}
  })
  var listener = function(){
    ++executions
  }
  var nativeConsoleWarn = console.warn
  console.warn = function(warning, object){
    test.equal(
      warning,
      "possible memory leak detected in %o",
      "warns about potential memory leaks"
    )
    test.equal(
      object,
      store,
      "and indicates the right store"
    )
    test.end()
    console.warn = nativeConsoleWarn
  }
  store.addChangeListener(listener)
  store.addChangeListener(listener)
})

tape("Store listener type check", function(test){
  var store = new Store({
    getStore(){}
  })
  test.throws(
    function(){
      store.addChangeListener(null)
    },
    "throws if a non-function value is passed"
  )
  test.end()
})

tape("Store removes change event", function(test){
  var store = new Store({
    getStore(){}
  })
  var executed = [0, 0, 0]
  var listeners = [
    function(){ executed[0]++ },
    function(){ executed[1]++ },
    function(){ executed[2]++ }
  ]
  listeners.forEach((listener) => store.addChangeListener(listener))
  store.emitChange()
  store.removeChangeListener(listeners[0])
  store.emitChange()
  store.removeChangeListener(listeners[1])
  store.emitChange()
  test.deepEqual(executed, [1, 2, 3])
  test.end()
})

tape("Store#createReactMixin", function(test){
  var _store = {
    foo : "bar"
  }
  var store = new Store({
    getStore(){
      return _store
    }
  })
  var ReactMixin = store.createReactMixin()
  test.deepEqual(ReactMixin.getInitialState(), {foo:"bar"})
  ReactMixin.setState = function(object){
    test.deepEqual(object, {
      foo : "bar"
    })
    test.end()
  }
  ReactMixin._onStoreChange = ReactMixin._onStoreChange.bind(ReactMixin)
  ReactMixin.componentDidMount()
  store.emitChange()
  ReactMixin.componentWillUnmount()
  _store = null
  store.emitChange()
})

tape("Store#createReactMixin custom", function(test){
  var _store = {
    foo : "bar"
  }
  var store = new Store({
    getStore(){
      return _store
    }
  })
  var ReactMixin = store.createReactMixin({
    _onStoreChange() {
      this.setState({
        prop : "yup"
      })
    }
  })
  test.deepEqual(ReactMixin.getInitialState(), {foo:"bar"})
  ReactMixin.setState = function(object){
    test.deepEqual(object, {
      prop : "yup"
    })
    test.end()
  }
  ReactMixin._onStoreChange = ReactMixin._onStoreChange.bind(ReactMixin)
  ReactMixin.componentDidMount()
  store.emitChange()
  ReactMixin.componentWillUnmount()
  _store = null
  store.emitChange()
})
