"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _YQMDNMVHcjs = require('./YQMDNMVH.cjs');


var _HY6WXQ7Bcjs = require('./HY6WXQ7B.cjs');



var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/popover/popover-disclosure.tsx
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
var usePopoverDisclosure = _743QABRAcjs.createHook.call(void 0, function usePopoverDisclosure2({ store, ...props }) {
  const context = _ZO6DH46Kcjs.usePopoverProviderContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "PopoverDisclosure must receive a `store` prop or be wrapped in a PopoverProvider component."
  );
  const onClickProp = props.onClick;
  const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    store == null ? void 0 : store.setAnchorElement(event.currentTarget);
    onClickProp == null ? void 0 : onClickProp(event);
  });
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ZO6DH46Kcjs.PopoverScopedContextProvider, { value: store, children: element }),
    [store]
  );
  props = {
    ...props,
    onClick
  };
  props = _YQMDNMVHcjs.usePopoverAnchor.call(void 0, { store, ...props });
  props = _HY6WXQ7Bcjs.useDialogDisclosure.call(void 0, { store, ...props });
  return props;
});
var PopoverDisclosure = _743QABRAcjs.forwardRef.call(void 0, function PopoverDisclosure2(props) {
  const htmlProps = usePopoverDisclosure(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.usePopoverDisclosure = usePopoverDisclosure; exports.PopoverDisclosure = PopoverDisclosure;
