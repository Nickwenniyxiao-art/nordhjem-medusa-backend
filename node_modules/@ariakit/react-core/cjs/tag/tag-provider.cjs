"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ETUTZY4Gcjs = require('../__chunks/ETUTZY4G.cjs');


var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');
require('../__chunks/CZKPX6W7.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function TagProvider(props = {}) {
  const store = _ETUTZY4Gcjs.useTagStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _THHAUPXTcjs.TagContextProvider, { value: store, children: props.children });
}


exports.TagProvider = TagProvider;
