"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _AI6VIQ5Fcjs = require('./AI6VIQ5F.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/hovercard/hovercard-heading.tsx
var TagName = "h1";
var useHovercardHeading = _743QABRAcjs.createHook.call(void 0, 
  function useHovercardHeading2(props) {
    props = _AI6VIQ5Fcjs.usePopoverHeading.call(void 0, props);
    return props;
  }
);
var HovercardHeading = _743QABRAcjs.forwardRef.call(void 0, function HovercardHeading2(props) {
  const htmlProps = useHovercardHeading(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useHovercardHeading = useHovercardHeading; exports.HovercardHeading = HovercardHeading;
