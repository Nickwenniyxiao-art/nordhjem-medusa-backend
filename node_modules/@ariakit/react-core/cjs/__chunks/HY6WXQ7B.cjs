"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _NRJF3KTKcjs = require('./NRJF3KTK.cjs');


var _5BVSKVUNcjs = require('./5BVSKVUN.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/dialog/dialog-disclosure.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var TagName = "button";
var useDialogDisclosure = _743QABRAcjs.createHook.call(void 0, 
  function useDialogDisclosure2({ store, ...props }) {
    const context = _5BVSKVUNcjs.useDialogProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "DialogDisclosure must receive a `store` prop or be wrapped in a DialogProvider component."
    );
    const contentElement = store.useState("contentElement");
    props = {
      "aria-haspopup": _dom.getPopupRole.call(void 0, contentElement, "dialog"),
      ...props
    };
    props = _NRJF3KTKcjs.useDisclosure.call(void 0, { store, ...props });
    return props;
  }
);
var DialogDisclosure = _743QABRAcjs.forwardRef.call(void 0, function DialogDisclosure2(props) {
  const htmlProps = useDialogDisclosure(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useDialogDisclosure = useDialogDisclosure; exports.DialogDisclosure = DialogDisclosure;
