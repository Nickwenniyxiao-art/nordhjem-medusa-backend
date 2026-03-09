"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _U46W2ZNXcjs = require('../__chunks/U46W2ZNX.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');


var _ZO6DH46Kcjs = require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/popover/popover-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function PopoverProvider(props = {}) {
  const store = _U46W2ZNXcjs.usePopoverStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ZO6DH46Kcjs.PopoverContextProvider, { value: store, children: props.children });
}


exports.PopoverProvider = PopoverProvider;
