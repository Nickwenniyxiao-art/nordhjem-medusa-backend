"use client";
import {
  useTooltipContext
} from "../__chunks/UZXQ5DX3.js";
import {
  usePopoverArrow
} from "../__chunks/QKVSMXME.js";
import "../__chunks/2SM3RB2N.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/Q5W46E73.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tooltip/tooltip-arrow.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "div";
var useTooltipArrow = createHook(
  function useTooltipArrow2({ store, size = 16, ...props }) {
    const context = useTooltipContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "TooltipArrow must be wrapped in a Tooltip component."
    );
    props = usePopoverArrow({ store, size, ...props });
    return props;
  }
);
var TooltipArrow = forwardRef(function TooltipArrow2(props) {
  const htmlProps = useTooltipArrow(props);
  return createElement(TagName, htmlProps);
});
export {
  TooltipArrow,
  useTooltipArrow
};
