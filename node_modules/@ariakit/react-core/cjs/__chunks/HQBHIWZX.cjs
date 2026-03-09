"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/disclosure/disclosure-store.ts
var _disclosurestore = require('@ariakit/core/disclosure/disclosure-store'); var Core = _interopRequireWildcard(_disclosurestore);
function useDisclosureStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.store, props.disclosure]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "open", "setOpen");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "mounted", "setMounted");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "animated");
  return Object.assign(store, { disclosure: props.disclosure });
}
function useDisclosureStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createDisclosureStore, props);
  return useDisclosureStoreProps(store, update, props);
}




exports.useDisclosureStoreProps = useDisclosureStoreProps; exports.useDisclosureStore = useDisclosureStore;
