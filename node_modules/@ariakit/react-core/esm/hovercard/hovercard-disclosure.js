"use client";
import {
  useHovercardProviderContext
} from "../__chunks/PTRWAQFT.js";
import {
  useVisuallyHidden
} from "../__chunks/2F57YTN4.js";
import {
  useDialogDisclosure
} from "../__chunks/APVORPDK.js";
import "../__chunks/NDVACHQI.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/HMKTUWOU.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/hovercard/hovercard-disclosure.tsx
import { contains } from "@ariakit/core/utils/dom";
import { addGlobalEventListener } from "@ariakit/core/utils/events";
import { invariant } from "@ariakit/core/utils/misc";
import { sync } from "@ariakit/core/utils/store";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "button";
var useHovercardDisclosure = createHook(function useHovercardDisclosure2({ store, ...props }) {
  const context = useHovercardProviderContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "HovercardDisclosure must receive a `store` prop or be wrapped in a HovercardProvider component."
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
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
        if (anchor && contains(anchor, nextActiveElement)) return;
        if (popover && contains(popover, nextActiveElement)) return;
        if (disclosure && contains(disclosure, nextActiveElement)) return;
        if (nextActiveElement.hasAttribute("data-focus-trap")) return;
      }
      setVisible(false);
    };
    return addGlobalEventListener("focusout", onBlur, true);
  }, [visible, store]);
  useEffect(() => {
    return sync(store, ["anchorElement"], (state) => {
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
  const onClick = useEvent((event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    store == null ? void 0 : store.setAutoFocusOnShow(true);
  });
  const onFocusProp = props.onFocus;
  const onFocus = useEvent((event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    setVisible(true);
  });
  const { style } = useVisuallyHidden();
  if (!visible) {
    props = {
      ...props,
      style: {
        ...style,
        ...props.style
      }
    };
  }
  const children = /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx("polyline", { points: "4,6 8,10 12,6" })
    }
  );
  props = {
    children,
    ...props,
    ref: useMergeRefs(store.setDisclosureElement, props.ref),
    onClick,
    onFocus
  };
  props = useDialogDisclosure({ store, ...props });
  return props;
});
var HovercardDisclosure = forwardRef(function HovercardDisclosure2(props) {
  const htmlProps = useHovercardDisclosure(props);
  return createElement(TagName, htmlProps);
});
export {
  HovercardDisclosure,
  useHovercardDisclosure
};
