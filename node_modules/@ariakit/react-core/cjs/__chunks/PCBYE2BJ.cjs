"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/popover/popover-disclosure-arrow.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "span";
var pointsMap = {
  top: "4,10 8,6 12,10",
  right: "6,4 10,8 6,12",
  bottom: "4,6 8,10 12,6",
  left: "10,4 6,8 10,12"
};
var usePopoverDisclosureArrow = _743QABRAcjs.createHook.call(void 0, function usePopoverDisclosureArrow2({ store, placement, ...props }) {
  const context = _ZO6DH46Kcjs.usePopoverContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "PopoverDisclosureArrow must be wrapped in a PopoverDisclosure component."
  );
  const position = store.useState((state) => placement || state.placement);
  const dir = position.split("-")[0];
  const points = pointsMap[dir];
  const children = _react.useMemo.call(void 0, 
    () => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        display: "block",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1.5,
        viewBox: "0 0 16 16",
        height: "1em",
        width: "1em",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "polyline", { points })
      }
    ),
    [points]
  );
  props = {
    children,
    "aria-hidden": true,
    ...props,
    style: {
      width: "1em",
      height: "1em",
      pointerEvents: "none",
      ...props.style
    }
  };
  return _misc.removeUndefinedValues.call(void 0, props);
});
var PopoverDisclosureArrow = _743QABRAcjs.forwardRef.call(void 0, 
  function PopoverDisclosureArrow2(props) {
    const htmlProps = usePopoverDisclosureArrow(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }
);




exports.usePopoverDisclosureArrow = usePopoverDisclosureArrow; exports.PopoverDisclosureArrow = PopoverDisclosureArrow;
