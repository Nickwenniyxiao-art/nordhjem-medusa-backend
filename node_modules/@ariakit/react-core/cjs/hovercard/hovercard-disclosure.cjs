"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _6N7G7IZOcjs = require('../__chunks/6N7G7IZO.cjs');


var _ZPT6IQKOcjs = require('../__chunks/ZPT6IQKO.cjs');


var _HY6WXQ7Bcjs = require('../__chunks/HY6WXQ7B.cjs');
require('../__chunks/NRJF3KTK.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/hovercard/hovercard-disclosure.tsx
var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _store = require('@ariakit/core/utils/store');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
var useHovercardDisclosure = _743QABRAcjs.createHook.call(void 0, function useHovercardDisclosure2({ store, ...props }) {
  const context = _6N7G7IZOcjs.useHovercardProviderContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "HovercardDisclosure must receive a `store` prop or be wrapped in a HovercardProvider component."
  );
  const [visible, setVisible] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (!visible) return;
    const onBlur = (event) => {
      if (!store) return;
      const nextActiveElement = event.relatedTarget;
      if (nextActiveElement) {
        const {
          anchorElement: anchor,
          popoverElement: popover,
          disclosureElement: disclosure
        } = store.getState();
        if (anchor && _dom.contains.call(void 0, anchor, nextActiveElement)) return;
        if (popover && _dom.contains.call(void 0, popover, nextActiveElement)) return;
        if (disclosure && _dom.contains.call(void 0, disclosure, nextActiveElement)) return;
        if (nextActiveElement.hasAttribute("data-focus-trap")) return;
      }
      setVisible(false);
    };
    return _events.addGlobalEventListener.call(void 0, "focusout", onBlur, true);
  }, [visible, store]);
  _react.useEffect.call(void 0, () => {
    return _store.sync.call(void 0, store, ["anchorElement"], (state) => {
      const anchor = state.anchorElement;
      if (!anchor) return;
      const observer = new MutationObserver(() => {
        if (!anchor.hasAttribute("data-focus-visible")) return;
        setVisible(true);
      });
      observer.observe(anchor, { attributeFilter: ["data-focus-visible"] });
      return () => observer.disconnect();
    });
  }, [store]);
  const onClickProp = props.onClick;
  const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    store == null ? void 0 : store.setAutoFocusOnShow(true);
  });
  const onFocusProp = props.onFocus;
  const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    setVisible(true);
  });
  const { style } = _ZPT6IQKOcjs.useVisuallyHidden.call(void 0, );
  if (!visible) {
    props = {
      ...props,
      style: {
        ...style,
        ...props.style
      }
    };
  }
  const children = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "polyline", { points: "4,6 8,10 12,6" })
    }
  );
  props = {
    children,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store.setDisclosureElement, props.ref),
    onClick,
    onFocus
  };
  props = _HY6WXQ7Bcjs.useDialogDisclosure.call(void 0, { store, ...props });
  return props;
});
var HovercardDisclosure = _743QABRAcjs.forwardRef.call(void 0, function HovercardDisclosure2(props) {
  const htmlProps = useHovercardDisclosure(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.HovercardDisclosure = HovercardDisclosure; exports.useHovercardDisclosure = useHovercardDisclosure;
