"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _JJQSOPYIcjs = require('./JJQSOPYI.cjs');


var _WJN3C6NMcjs = require('./WJN3C6NM.cjs');


var _77IUZSUBcjs = require('./77IUZSUB.cjs');


var _CZKPX6W7cjs = require('./CZKPX6W7.cjs');


var _MLRWKUIEcjs = require('./MLRWKUIE.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/menu/menu-store.ts
var _menustore = require('@ariakit/core/menu/menu-store'); var Core = _interopRequireWildcard(_menustore);
function useMenuStoreProps(store, update, props) {
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, update, [props.combobox, props.parent, props.menubar]);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "values", "setValues");
  return Object.assign(
    _77IUZSUBcjs.useHovercardStoreProps.call(void 0, 
      _CZKPX6W7cjs.useCompositeStoreProps.call(void 0, store, update, props),
      update,
      props
    ),
    {
      combobox: props.combobox,
      parent: props.parent,
      menubar: props.menubar
    }
  );
}
function useMenuStore(props = {}) {
  const parent = _JJQSOPYIcjs.useMenuContext.call(void 0, );
  const menubar = _WJN3C6NMcjs.useMenubarContext.call(void 0, );
  const combobox = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
  props = {
    ...props,
    parent: props.parent !== void 0 ? props.parent : parent,
    menubar: props.menubar !== void 0 ? props.menubar : menubar,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createMenuStore, props);
  return useMenuStoreProps(store, update, props);
}




exports.useMenuStoreProps = useMenuStoreProps; exports.useMenuStore = useMenuStore;
