"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _SDXRA2A6cjs = require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/YY2UXBEB.cjs');


var _SS26HAQ2cjs = require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/collection/collection-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function CollectionProvider(props = {}) {
  const store = _SDXRA2A6cjs.useCollectionStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _SS26HAQ2cjs.CollectionContextProvider, { value: store, children: props.children });
}


exports.CollectionProvider = CollectionProvider;
