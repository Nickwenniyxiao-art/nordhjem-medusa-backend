"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/tag/tag-store.ts
var _tagstore = require('@ariakit/core/tag/tag-store'); var Core = _interopRequireWildcard(_tagstore);
function useTagStoreProps(store, update, props) {
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "value", "setValue");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "values", "setValues");
  return _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props);
}
function useTagStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createTagStore, props);
  return useTagStoreProps(store, update, props);
}




exports.useTagStoreProps = useTagStoreProps; exports.useTagStore = useTagStore;
