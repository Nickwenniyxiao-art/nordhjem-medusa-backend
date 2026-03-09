"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _LZIHTTN3cjs = require('./LZIHTTN3.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/hovercard/hovercard-description.tsx
var TagName = "p";
var useHovercardDescription = _743QABRAcjs.createHook.call(void 0, function useHovercardDescription2(props) {
  props = _LZIHTTN3cjs.usePopoverDescription.call(void 0, props);
  return props;
});
var HovercardDescription = _743QABRAcjs.forwardRef.call(void 0, function HovercardDescription2(props) {
  const htmlProps = useHovercardDescription(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useHovercardDescription = useHovercardDescription; exports.HovercardDescription = HovercardDescription;
