"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _743QABRAcjs = require('./743QABRA.cjs');

// src/separator/separator.tsx
var TagName = "hr";
var useSeparator = _743QABRAcjs.createHook.call(void 0, 
  function useSeparator2({ orientation = "horizontal", ...props }) {
    props = {
      role: "separator",
      "aria-orientation": orientation,
      ...props
    };
    return props;
  }
);
var Separator = _743QABRAcjs.forwardRef.call(void 0, function Separator2(props) {
  const htmlProps = useSeparator(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useSeparator = useSeparator; exports.Separator = Separator;
