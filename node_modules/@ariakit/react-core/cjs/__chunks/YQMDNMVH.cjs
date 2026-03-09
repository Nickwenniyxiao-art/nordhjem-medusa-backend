"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/popover/popover-anchor.tsx
var TagName = "div";
var usePopoverAnchor = _743QABRAcjs.createHook.call(void 0, 
  function usePopoverAnchor2({ store, ...props }) {
    const context = _ZO6DH46Kcjs.usePopoverProviderContext.call(void 0, );
    store = store || context;
    props = {
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store == null ? void 0 : store.setAnchorElement, props.ref)
    };
    return props;
  }
);
var PopoverAnchor = _743QABRAcjs.forwardRef.call(void 0, function PopoverAnchor2(props) {
  const htmlProps = usePopoverAnchor(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.usePopoverAnchor = usePopoverAnchor; exports.PopoverAnchor = PopoverAnchor;
