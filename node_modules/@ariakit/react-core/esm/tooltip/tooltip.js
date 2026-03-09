"use client";
import {
  TooltipScopedContextProvider,
  useTooltipProviderContext
} from "../__chunks/UZXQ5DX3.js";
import {
  useHovercard
} from "../__chunks/4HTVKX2Y.js";
import "../__chunks/X7QOZUD3.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/KW7Z5AIL.js";
import {
  createDialogComponent
} from "../__chunks/Z32PU2LQ.js";
import "../__chunks/VJH3F6TN.js";
import "../__chunks/AOQQTIBO.js";
import "../__chunks/5M6RIVE2.js";
import "../__chunks/BFOIJXK2.js";
import "../__chunks/2F57YTN4.js";
import "../__chunks/3HM4TGWW.js";
import "../__chunks/6GXEOXGT.js";
import "../__chunks/KKITJVHA.js";
import "../__chunks/U3R3WHDK.js";
import "../__chunks/JSI7U3EA.js";
import "../__chunks/B6W4QFKS.js";
import "../__chunks/OT5RJDXG.js";
import "../__chunks/CZ4GFWYL.js";
import "../__chunks/Z5GCVBAY.js";
import "../__chunks/IGR4SXG2.js";
import "../__chunks/677M2CI3.js";
import "../__chunks/S7U6BLGA.js";
import "../__chunks/P45QRJLH.js";
import "../__chunks/3NDVDEB4.js";
import "../__chunks/AOUGVQZ3.js";
import "../__chunks/K2ZF5NU7.js";
import "../__chunks/63XF7ACK.js";
import "../__chunks/6B3RXHKP.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/JG4VNI52.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tooltip/tooltip.tsx
import { contains } from "@ariakit/core/utils/dom";
import { invariant, isFalsyBooleanCallback } from "@ariakit/core/utils/misc";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useTooltip = createHook(
  function useTooltip2({
    store,
    portal = true,
    gutter = 8,
    preserveTabOrder = false,
    hideOnHoverOutside = true,
    hideOnInteractOutside = true,
    ...props
  }) {
    const context = useTooltipProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "Tooltip must receive a `store` prop or be wrapped in a TooltipProvider component."
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(TooltipScopedContextProvider, { value: store, children: element }),
      [store]
    );
    const role = store.useState(
      (state) => state.type === "description" ? "tooltip" : "none"
    );
    props = { role, ...props };
    props = useHovercard({
      ...props,
      store,
      portal,
      gutter,
      preserveTabOrder,
      hideOnHoverOutside(event) {
        if (isFalsyBooleanCallback(hideOnHoverOutside, event)) return false;
        const anchorElement = store == null ? void 0 : store.getState().anchorElement;
        if (!anchorElement) return true;
        if ("focusVisible" in anchorElement.dataset) return false;
        return true;
      },
      hideOnInteractOutside: (event) => {
        if (isFalsyBooleanCallback(hideOnInteractOutside, event)) return false;
        const anchorElement = store == null ? void 0 : store.getState().anchorElement;
        if (!anchorElement) return true;
        if (contains(anchorElement, event.target)) return false;
        return true;
      }
    });
    return props;
  }
);
var Tooltip = createDialogComponent(
  forwardRef(function Tooltip2(props) {
    const htmlProps = useTooltip(props);
    return createElement(TagName, htmlProps);
  }),
  useTooltipProviderContext
);
export {
  Tooltip,
  useTooltip
};
