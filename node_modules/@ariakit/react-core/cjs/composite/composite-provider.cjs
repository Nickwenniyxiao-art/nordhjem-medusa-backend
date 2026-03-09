"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _CZKPX6W7cjs = require('../__chunks/CZKPX6W7.cjs');
require('../__chunks/SDXRA2A6.cjs');


var _WI7QXQL7cjs = require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/composite/composite-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function CompositeProvider(props = {}) {
  const store = _CZKPX6W7cjs.useCompositeStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WI7QXQL7cjs.CompositeContextProvider, { value: store, children: props.children });
}


exports.CompositeProvider = CompositeProvider;
