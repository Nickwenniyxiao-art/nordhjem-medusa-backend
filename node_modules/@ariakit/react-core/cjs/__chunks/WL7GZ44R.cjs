"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _6GWYBIDMcjs = require('./6GWYBIDM.cjs');


var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/popover/popover-dismiss.tsx
var TagName = "button";
var usePopoverDismiss = _743QABRAcjs.createHook.call(void 0, 
  function usePopoverDismiss2({ store, ...props }) {
    const context = _ZO6DH46Kcjs.usePopoverScopedContext.call(void 0, );
    store = store || context;
    props = _6GWYBIDMcjs.useDialogDismiss.call(void 0, { store, ...props });
    return props;
  }
);
var PopoverDismiss = _743QABRAcjs.forwardRef.call(void 0, function PopoverDismiss2(props) {
  const htmlProps = usePopoverDismiss(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.usePopoverDismiss = usePopoverDismiss; exports.PopoverDismiss = PopoverDismiss;
