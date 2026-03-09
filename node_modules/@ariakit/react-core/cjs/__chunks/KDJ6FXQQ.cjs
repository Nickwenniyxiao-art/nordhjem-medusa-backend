"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/checkbox/checkbox-store.ts
var _checkboxstore = require('@ariakit/core/checkbox/checkbox-store'); var Core = _interopRequireWildcard(_checkboxstore);
function useCheckboxStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.store]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "value", "setValue");
  return store;
}
function useCheckboxStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createCheckboxStore, props);
  return useCheckboxStoreProps(store, update, props);
}




exports.useCheckboxStoreProps = useCheckboxStoreProps; exports.useCheckboxStore = useCheckboxStore;
