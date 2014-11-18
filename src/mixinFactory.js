function mixinFactory(Store){
  var StoreMixin = {
    getInitialState() {
      return Store.getStore()
    },
    componentDidMount() {
      Store.addChangeListener(this._onStoreChange)
    },
    componentWillUnmount() {
      Store.removeChangeListener(this._onStoreChange)
    },
    _onStoreChange() {
      this.setState(Store.getStore())
    }
  }
  return StoreMixin
}

module.exports = mixinFactory
