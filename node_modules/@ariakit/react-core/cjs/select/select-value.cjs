"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-value.tsx
function SelectValue({
  store,
  fallback,
  children
} = {}) {
  const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
  store = store || context;
  const value = _YY2UXBEBcjs.useStoreState.call(void 0, store, (state) => {
    if (!(state == null ? void 0 : state.value.length)) return fallback;
    return state.value;
  });
  if (children) {
    return children(value || "");
  }
  return value;
}


exports.SelectValue = SelectValue;
