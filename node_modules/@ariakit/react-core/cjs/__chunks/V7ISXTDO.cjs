"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _WL7GZ44Rcjs = require('./WL7GZ44R.cjs');


var _6N7G7IZOcjs = require('./6N7G7IZO.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/hovercard/hovercard-dismiss.tsx
var TagName = "button";
var useHovercardDismiss = _743QABRAcjs.createHook.call(void 0, 
  function useHovercardDismiss2({ store, ...props }) {
    const context = _6N7G7IZOcjs.useHovercardScopedContext.call(void 0, );
    store = store || context;
    props = _WL7GZ44Rcjs.usePopoverDismiss.call(void 0, { store, ...props });
    return props;
  }
);
var HovercardDismiss = _743QABRAcjs.forwardRef.call(void 0, function HovercardDismiss2(props) {
  const htmlProps = useHovercardDismiss(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useHovercardDismiss = useHovercardDismiss; exports.HovercardDismiss = HovercardDismiss;
