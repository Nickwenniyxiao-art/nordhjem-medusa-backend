"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _26FZXC26cjs = require('../__chunks/26FZXC26.cjs');
require('../__chunks/CZKPX6W7.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-bar-store.ts
var _react = require('react');
function useMenuBarStoreProps(store, update, props) {
  return _26FZXC26cjs.useMenubarStoreProps.call(void 0, store, update, props);
}
function useMenuBarStore(props = {}) {
  _react.useEffect.call(void 0, () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "useMenuBarStore is deprecated. Use useMenubarStore instead.",
        "See https://ariakit.org/reference/use-menubar-store"
      );
    }
  }, []);
  return _26FZXC26cjs.useMenubarStore.call(void 0, props);
}



exports.useMenuBarStore = useMenuBarStore; exports.useMenuBarStoreProps = useMenuBarStoreProps;
