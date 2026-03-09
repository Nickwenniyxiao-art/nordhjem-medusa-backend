"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _KDJ6FXQQcjs = require('../__chunks/KDJ6FXQQ.cjs');


var _HNUUQ6LRcjs = require('../__chunks/HNUUQ6LR.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/checkbox/checkbox-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function CheckboxProvider(props = {}) {
  const store = _KDJ6FXQQcjs.useCheckboxStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _HNUUQ6LRcjs.CheckboxContextProvider, { value: store, children: props.children });
}


exports.CheckboxProvider = CheckboxProvider;
