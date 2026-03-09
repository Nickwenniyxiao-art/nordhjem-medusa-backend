"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _U46W2ZNXcjs = require('../__chunks/U46W2ZNX.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/composite/composite-overflow-store.ts
var _compositeoverflowstore = require('@ariakit/core/composite/composite-overflow-store'); var Core = _interopRequireWildcard(_compositeoverflowstore);
function useCompositeOverflowStoreProps(store, update, props) {
  return _U46W2ZNXcjs.usePopoverStoreProps.call(void 0, store, update, props);
}
function useCompositeOverflowStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createCompositeOverflowStore, props);
  return useCompositeOverflowStoreProps(store, update, props);
}



exports.useCompositeOverflowStore = useCompositeOverflowStore; exports.useCompositeOverflowStoreProps = useCompositeOverflowStoreProps;
