"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _HY6WXQ7Bcjs = require('../__chunks/HY6WXQ7B.cjs');
require('../__chunks/NRJF3KTK.cjs');


var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-disclosure.tsx
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
var children = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
  "svg",
  {
    "aria-hidden": "true",
    display: "block",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
    viewBox: "0 0 16 16",
    height: "1em",
    width: "1em",
    pointerEvents: "none",
    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "polyline", { points: "4,6 8,10 12,6" })
  }
);
var useComboboxDisclosure = _743QABRAcjs.createHook.call(void 0, function useComboboxDisclosure2({ store, ...props }) {
  const context = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "ComboboxDisclosure must receive a `store` prop or be wrapped in a ComboboxProvider component."
  );
  const onMouseDownProp = props.onMouseDown;
  const onMouseDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onMouseDownProp == null ? void 0 : onMouseDownProp(event);
    event.preventDefault();
    store == null ? void 0 : store.move(null);
  });
  const onClickProp = props.onClick;
  const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    if (!store) return;
    const { baseElement } = store.getState();
    store.setDisclosureElement(baseElement);
  });
  const open = store.useState("open");
  props = {
    children,
    tabIndex: -1,
    "aria-label": open ? "Hide popup" : "Show popup",
    "aria-expanded": open,
    ...props,
    onMouseDown,
    onClick
  };
  props = _HY6WXQ7Bcjs.useDialogDisclosure.call(void 0, { store, ...props });
  return props;
});
var ComboboxDisclosure = _743QABRAcjs.forwardRef.call(void 0, function ComboboxDisclosure2(props) {
  const htmlProps = useComboboxDisclosure(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ComboboxDisclosure = ComboboxDisclosure; exports.useComboboxDisclosure = useComboboxDisclosure;
