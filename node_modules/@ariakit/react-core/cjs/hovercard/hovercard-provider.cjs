"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _77IUZSUBcjs = require('../__chunks/77IUZSUB.cjs');


var _6N7G7IZOcjs = require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/U46W2ZNX.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/hovercard/hovercard-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function HovercardProvider(props = {}) {
  const store = _77IUZSUBcjs.useHovercardStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _6N7G7IZOcjs.HovercardContextProvider, { value: store, children: props.children });
}


exports.HovercardProvider = HovercardProvider;
