"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _U46W2ZNXcjs = require('./U46W2ZNX.cjs');



var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');


var _MLRWKUIEcjs = require('./MLRWKUIE.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/select/select-store.ts
var _selectstore = require('@ariakit/core/select/select-store'); var Core = _interopRequireWildcard(_selectstore);
function useSelectStoreOptions(props) {
  const combobox = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
  props = {
    ...props,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  return _CZKPX6W7cjs.useCompositeStoreOptions.call(void 0, props);
}
function useSelectStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.combobox]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "value", "setValue");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "setValueOnMove");
  return Object.assign(
    _U46W2ZNXcjs.usePopoverStoreProps.call(void 0, 
      _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props),
      update,
      props
    ),
    { combobox: props.combobox }
  );
}
function useSelectStore(props = {}) {
  props = useSelectStoreOptions(props);
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createSelectStore, props);
  return useSelectStoreProps(store, update, props);
}





exports.useSelectStoreOptions = useSelectStoreOptions; exports.useSelectStoreProps = useSelectStoreProps; exports.useSelectStore = useSelectStore;
