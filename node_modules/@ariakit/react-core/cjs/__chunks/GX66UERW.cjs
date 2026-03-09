"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _26P4PLHIcjs = require('./26P4PLHI.cjs');


var _3ZDSDKC6cjs = require('./3ZDSDKC6.cjs');


var _HQBHIWZXcjs = require('./HQBHIWZX.cjs');


var _L22B4P6Ycjs = require('./L22B4P6Y.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/dialog/dialog-backdrop.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function DialogBackdrop({
  store,
  backdrop,
  alwaysVisible,
  hidden
}) {
  const ref = _react.useRef.call(void 0, null);
  const disclosure = _HQBHIWZXcjs.useDisclosureStore.call(void 0, { disclosure: store });
  const contentElement = _YY2UXBEBcjs.useStoreState.call(void 0, store, "contentElement");
  _react.useEffect.call(void 0, () => {
    const backdrop2 = ref.current;
    const dialog = contentElement;
    if (!backdrop2) return;
    if (!dialog) return;
    backdrop2.style.zIndex = getComputedStyle(dialog).zIndex;
  }, [contentElement]);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    const id = contentElement == null ? void 0 : contentElement.id;
    if (!id) return;
    const backdrop2 = ref.current;
    if (!backdrop2) return;
    return _26P4PLHIcjs.markAncestor.call(void 0, backdrop2, id);
  }, [contentElement]);
  const props = _3ZDSDKC6cjs.useDisclosureContent.call(void 0, {
    ref,
    store: disclosure,
    role: "presentation",
    "data-backdrop": (contentElement == null ? void 0 : contentElement.id) || "",
    alwaysVisible,
    hidden: hidden != null ? hidden : void 0,
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
  if (!backdrop) return null;
  if (_react.isValidElement.call(void 0, backdrop)) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L22B4P6Ycjs.Role, { ...props, render: backdrop });
  }
  const Component = typeof backdrop !== "boolean" ? backdrop : "div";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L22B4P6Ycjs.Role, { ...props, render: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, {}) });
}



exports.DialogBackdrop = DialogBackdrop;
