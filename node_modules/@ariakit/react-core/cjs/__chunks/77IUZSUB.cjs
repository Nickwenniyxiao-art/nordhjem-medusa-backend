"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _U46W2ZNXcjs = require('./U46W2ZNX.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/hovercard/hovercard-store.ts
var _hovercardstore = require('@ariakit/core/hovercard/hovercard-store'); var Core = _interopRequireWildcard(_hovercardstore);
function useHovercardStoreProps(store, update, props) {
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "timeout");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "showTimeout");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "hideTimeout");
  return _U46W2ZNXcjs.usePopoverStoreProps.call(void 0, store, update, props);
}
function useHovercardStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createHovercardStore, props);
  return useHovercardStoreProps(store, update, props);
}




exports.useHovercardStoreProps = useHovercardStoreProps; exports.useHovercardStore = useHovercardStore;
