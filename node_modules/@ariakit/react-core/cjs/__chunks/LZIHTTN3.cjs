"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _TIQJZGMOcjs = require('./TIQJZGMO.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/popover/popover-description.tsx
var TagName = "p";
var usePopoverDescription = _743QABRAcjs.createHook.call(void 0, function usePopoverDescription2(props) {
  props = _TIQJZGMOcjs.useDialogDescription.call(void 0, props);
  return props;
});
var PopoverDescription = _743QABRAcjs.forwardRef.call(void 0, function PopoverDescription2(props) {
  const htmlProps = usePopoverDescription(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.usePopoverDescription = usePopoverDescription; exports.PopoverDescription = PopoverDescription;
