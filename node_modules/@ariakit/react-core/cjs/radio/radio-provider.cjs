"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _OU7YN4Y6cjs = require('../__chunks/OU7YN4Y6.cjs');


var _567HKB5Ncjs = require('../__chunks/567HKB5N.cjs');
require('../__chunks/CZKPX6W7.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/radio/radio-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function RadioProvider(props = {}) {
  const store = _OU7YN4Y6cjs.useRadioStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _567HKB5Ncjs.RadioContextProvider, { value: store, children: props.children });
}


exports.RadioProvider = RadioProvider;
