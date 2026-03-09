"use client";
import {
  useDialogDisclosure
} from "../__chunks/APVORPDK.js";
import "../__chunks/NDVACHQI.js";
import {
  useComboboxProviderContext
} from "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/HMKTUWOU.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/combobox/combobox-disclosure.tsx
import { invariant } from "@ariakit/core/utils/misc";
import { jsx } from "react/jsx-runtime";
var TagName = "button";
var children = /* @__PURE__ */ jsx(
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
    children: /* @__PURE__ */ jsx("polyline", { points: "4,6 8,10 12,6" })
  }
);
var useComboboxDisclosure = createHook(function useComboboxDisclosure2({ store, ...props }) {
  const context = useComboboxProviderContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "ComboboxDisclosure must receive a `store` prop or be wrapped in a ComboboxProvider component."
  );
  const onMouseDownProp = props.onMouseDown;
  const onMouseDown = useEvent((event) => {
    onMouseDownProp == null ? void 0 : onMouseDownProp(event);
    event.preventDefault();
    store == null ? void 0 : store.move(null);
  });
  const onClickProp = props.onClick;
  const onClick = useEvent((event) => {
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
  props = useDialogDisclosure({ store, ...props });
  return props;
});
var ComboboxDisclosure = forwardRef(function ComboboxDisclosure2(props) {
  const htmlProps = useComboboxDisclosure(props);
  return createElement(TagName, htmlProps);
});
export {
  ComboboxDisclosure,
  useComboboxDisclosure
};
