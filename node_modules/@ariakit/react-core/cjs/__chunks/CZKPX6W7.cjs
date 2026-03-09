"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _SDXRA2A6cjs = require('./SDXRA2A6.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/composite/composite-store.ts
var _compositestore = require('@ariakit/core/composite/composite-store'); var Core = _interopRequireWildcard(_compositestore);
function useCompositeStoreOptions(props) {
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  return { id, ...props };
}
function useCompositeStoreProps(store, update, props) {
  store = _SDXRA2A6cjs.useCollectionStoreProps.call(void 0, store, update, props);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "activeId", "setActiveId");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "includesBaseElement");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "virtualFocus");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "orientation");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "rtl");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "focusLoop");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "focusWrap");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "focusShift");
  return store;
}
function useCompositeStore(props = {}) {
  props = useCompositeStoreOptions(props);
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createCompositeStore, props);
  return useCompositeStoreProps(store, update, props);
}





exports.useCompositeStoreOptions = useCompositeStoreOptions; exports.useCompositeStoreProps = useCompositeStoreProps; exports.useCompositeStore = useCompositeStore;
