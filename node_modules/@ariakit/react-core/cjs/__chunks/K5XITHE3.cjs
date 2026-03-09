"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _WJN3C6NMcjs = require('./WJN3C6NM.cjs');


var _26FZXC26cjs = require('./26FZXC26.cjs');

// src/menubar/menubar-provider.tsx
var _jsxruntime = require('react/jsx-runtime');
function MenubarProvider(props = {}) {
  const store = _26FZXC26cjs.useMenubarStore.call(void 0, props);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WJN3C6NMcjs.MenubarContextProvider, { value: store, children: props.children });
}



exports.MenubarProvider = MenubarProvider;
