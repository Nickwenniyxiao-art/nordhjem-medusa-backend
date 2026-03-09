"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _THHAUPXTcjs = require('./THHAUPXT.cjs');


var _U46W2ZNXcjs = require('./U46W2ZNX.cjs');



var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/combobox/combobox-store.ts
var _comboboxstore = require('@ariakit/core/combobox/combobox-store'); var Core = _interopRequireWildcard(_comboboxstore);
function useComboboxStoreOptions(props) {
  const tag = _THHAUPXTcjs.useTagContext.call(void 0, );
  props = {
    ...props,
    tag: props.tag !== void 0 ? props.tag : tag
  };
  return _CZKPX6W7cjs.useCompositeStoreOptions.call(void 0, props);
}
function useComboboxStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.tag]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "value", "setValue");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "selectedValue", "setSelectedValue");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "resetValueOnHide");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "resetValueOnSelect");
  return Object.assign(
    _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, 
      _U46W2ZNXcjs.usePopoverStoreProps.call(void 0, store, update, props),
      update,
      props
    ),
    { tag: props.tag }
  );
}
function useComboboxStore(props = {}) {
  props = useComboboxStoreOptions(props);
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createComboboxStore, props);
  return useComboboxStoreProps(store, update, props);
}





exports.useComboboxStoreOptions = useComboboxStoreOptions; exports.useComboboxStoreProps = useComboboxStoreProps; exports.useComboboxStore = useComboboxStore;
