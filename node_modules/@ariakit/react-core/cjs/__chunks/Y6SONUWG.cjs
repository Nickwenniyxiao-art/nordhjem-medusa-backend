"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _4NZHMZNFcjs = require('./4NZHMZNF.cjs');


var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');


var _MLRWKUIEcjs = require('./MLRWKUIE.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/tab/tab-store.ts
var _tabstore = require('@ariakit/core/tab/tab-store'); var Core = _interopRequireWildcard(_tabstore);
var _react = require('react');
function useTabStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.composite, props.combobox]);
  store = _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "selectedId", "setSelectedId");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "selectOnMove");
  const [panels, updatePanels] = _YY2UXBEBcjs.useStore.call(void 0, () => store.panels, {});
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, updatePanels, [store, updatePanels]);
  return Object.assign(
    _react.useMemo.call(void 0, () => ({ ...store, panels }), [store, panels]),
    { composite: props.composite, combobox: props.combobox }
  );
}
function useTabStore(props = {}) {
  const combobox = _MLRWKUIEcjs.useComboboxContext.call(void 0, );
  const composite = _4NZHMZNFcjs.useSelectContext.call(void 0, ) || combobox;
  props = {
    ...props,
    composite: props.composite !== void 0 ? props.composite : composite,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createTabStore, props);
  return useTabStoreProps(store, update, props);
}




exports.useTabStoreProps = useTabStoreProps; exports.useTabStore = useTabStore;
