"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _HQBHIWZXcjs = require('./HQBHIWZX.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/dialog/dialog-store.ts
var _dialogstore = require('@ariakit/core/dialog/dialog-store'); var Core = _interopRequireWildcard(_dialogstore);
function useDialogStoreProps(store, update, props) {
  return _HQBHIWZXcjs.useDisclosureStoreProps.call(void 0, store, update, props);
}
function useDialogStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createDialogStore, props);
  return useDialogStoreProps(store, update, props);
}




exports.useDialogStoreProps = useDialogStoreProps; exports.useDialogStore = useDialogStore;
