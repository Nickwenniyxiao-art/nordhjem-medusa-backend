"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/toolbar/toolbar-store.ts
var _toolbarstore = require('@ariakit/core/toolbar/toolbar-store'); var Core = _interopRequireWildcard(_toolbarstore);
function useToolbarStoreProps(store, update, props) {
  return _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props);
}
function useToolbarStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createToolbarStore, props);
  return useToolbarStoreProps(store, update, props);
}




exports.useToolbarStoreProps = useToolbarStoreProps; exports.useToolbarStore = useToolbarStore;
