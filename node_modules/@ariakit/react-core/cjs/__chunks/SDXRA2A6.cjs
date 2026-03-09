"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/collection/collection-store.ts
var _collectionstore = require('@ariakit/core/collection/collection-store'); var Core = _interopRequireWildcard(_collectionstore);
function useCollectionStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.store]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "items", "setItems");
  return store;
}
function useCollectionStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createCollectionStore, props);
  return useCollectionStoreProps(store, update, props);
}




exports.useCollectionStoreProps = useCollectionStoreProps; exports.useCollectionStore = useCollectionStore;
