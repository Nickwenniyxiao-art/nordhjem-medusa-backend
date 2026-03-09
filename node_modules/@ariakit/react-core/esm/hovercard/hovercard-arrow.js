"use client";
import {
  usePopoverArrow
} from "../__chunks/QKVSMXME.js";
import "../__chunks/2SM3RB2N.js";
import {
  useHovercardContext
} from "../__chunks/PTRWAQFT.js";
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

// src/hovercard/hovercard-arrow.tsx
var TagName = "div";
var useHovercardArrow = createHook(
  function useHovercardArrow2({ store, ...props }) {
    const context = useHovercardContext();
    store = store || context;
    props = usePopoverArrow({ store, ...props });
    return props;
  }
);
var HovercardArrow = forwardRef(function HovercardArrow2(props) {
  const htmlProps = useHovercardArrow(props);
  return createElement(TagName, htmlProps);
});
export {
  HovercardArrow,
  useHovercardArrow
};
