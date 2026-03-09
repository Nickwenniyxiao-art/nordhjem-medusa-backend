"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _6425RWY5cjs = require('../__chunks/6425RWY5.cjs');


var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function FormProvider(props = {}) {
  const store = _6425RWY5cjs.useFormStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FHB7634Ocjs.FormContextProvider, { value: store, children: props.children });
}


exports.FormProvider = FormProvider;
