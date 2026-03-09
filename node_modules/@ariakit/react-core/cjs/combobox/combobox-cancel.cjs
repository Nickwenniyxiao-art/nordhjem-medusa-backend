"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _DIWKSV34cjs = require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-cancel.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
var children = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
  "svg",
  {
    "aria-hidden": "true",
    display: "block",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
    width: "1em",
    height: "1em",
    pointerEvents: "none",
    children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "line", { x1: "5", y1: "5", x2: "11", y2: "11" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "line", { x1: "5", y1: "11", x2: "11", y2: "5" })
    ]
  }
);
var useComboboxCancel = _743QABRAcjs.createHook.call(void 0, 
  function useComboboxCancel2({ store, hideWhenEmpty, ...props }) {
    const context = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "ComboboxCancel must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setValue("");
      store == null ? void 0 : store.move(null);
    });
    const comboboxId = store.useState((state) => {
      var _a;
      return (_a = state.baseElement) == null ? void 0 : _a.id;
    });
    const empty = store.useState((state) => state.value === "");
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => {
        if (!hideWhenEmpty) return element;
        if (empty) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react.Fragment, {});
        return element;
      },
      [hideWhenEmpty, empty]
    );
    props = {
      children,
      "aria-label": "Clear input",
      // This aria-controls will ensure the combobox popup remains visible when
      // this element gets focused. This logic is done in the ComboboxPopover
      // component.
      "aria-controls": comboboxId,
      ...props,
      onClick
    };
    props = _DIWKSV34cjs.useButton.call(void 0, props);
    return props;
  }
);
var ComboboxCancel = _743QABRAcjs.forwardRef.call(void 0, function ComboboxCancel2(props) {
  const htmlProps = useComboboxCancel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ComboboxCancel = ComboboxCancel; exports.useComboboxCancel = useComboboxCancel;
