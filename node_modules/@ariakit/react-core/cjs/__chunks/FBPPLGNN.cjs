"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _T3QB4FR3cjs = require('./T3QB4FR3.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/focusable/focusable-container.tsx
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useFocusableContainer = _743QABRAcjs.createHook.call(void 0, function useFocusableContainer2({ autoFocusOnShow = true, ...props }) {
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _T3QB4FR3cjs.FocusableContext.Provider, { value: autoFocusOnShow, children: element }),
    [autoFocusOnShow]
  );
  return props;
});
var FocusableContainer = _743QABRAcjs.forwardRef.call(void 0, function FocusableContainer2(props) {
  const htmlProps = useFocusableContainer(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useFocusableContainer = useFocusableContainer; exports.FocusableContainer = FocusableContainer;
