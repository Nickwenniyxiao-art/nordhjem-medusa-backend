"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _OISF5P4Tcjs = require('./OISF5P4T.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/popover/popover-heading.tsx
var TagName = "h1";
var usePopoverHeading = _743QABRAcjs.createHook.call(void 0, 
  function usePopoverHeading2(props) {
    props = _OISF5P4Tcjs.useDialogHeading.call(void 0, props);
    return props;
  }
);
var PopoverHeading = _743QABRAcjs.forwardRef.call(void 0, function PopoverHeading2(props) {
  const htmlProps = usePopoverHeading(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.usePopoverHeading = usePopoverHeading; exports.PopoverHeading = PopoverHeading;
