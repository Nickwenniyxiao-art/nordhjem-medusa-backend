"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZXVQQIOScjs = require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');


var _5BVSKVUNcjs = require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/dialog/dialog-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function DialogProvider(props = {}) {
  const store = _ZXVQQIOScjs.useDialogStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _5BVSKVUNcjs.DialogContextProvider, { value: store, children: props.children });
}


exports.DialogProvider = DialogProvider;
