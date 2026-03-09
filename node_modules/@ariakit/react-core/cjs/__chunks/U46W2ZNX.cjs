"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _ZXVQQIOScjs = require('./ZXVQQIOS.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/popover/popover-store.ts
var _popoverstore = require('@ariakit/core/popover/popover-store'); var Core = _interopRequireWildcard(_popoverstore);
function usePopoverStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.popover]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "placement");
  return _ZXVQQIOScjs.useDialogStoreProps.call(void 0, store, update, props);
}
function usePopoverStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createPopoverStore, props);
  return usePopoverStoreProps(store, update, props);
}




exports.usePopoverStoreProps = usePopoverStoreProps; exports.usePopoverStore = usePopoverStore;
