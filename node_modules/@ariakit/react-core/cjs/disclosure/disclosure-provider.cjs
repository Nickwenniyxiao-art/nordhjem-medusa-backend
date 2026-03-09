"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _HQBHIWZXcjs = require('../__chunks/HQBHIWZX.cjs');


var _HHXD2YNZcjs = require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/disclosure/disclosure-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function DisclosureProvider(props = {}) {
  const store = _HQBHIWZXcjs.useDisclosureStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _HHXD2YNZcjs.DisclosureContextProvider, { value: store, children: props.children });
}


exports.DisclosureProvider = DisclosureProvider;
