"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/radio/radio-store.ts
var _radiostore = require('@ariakit/core/radio/radio-store'); var Core = _interopRequireWildcard(_radiostore);
function useRadioStoreProps(store, update, props) {
  store = _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "value", "setValue");
  return store;
}
function useRadioStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createRadioStore, props);
  return useRadioStoreProps(store, update, props);
}




exports.useRadioStoreProps = useRadioStoreProps; exports.useRadioStore = useRadioStore;
