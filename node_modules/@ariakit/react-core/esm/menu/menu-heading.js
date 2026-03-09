"use client";
import {
  useHovercardHeading
} from "../__chunks/IFTBKUWI.js";
import "../__chunks/4WJCKDQE.js";
import "../__chunks/O4VW3LHI.js";
import "../__chunks/FLYCYZJT.js";
import "../__chunks/CZ4GFWYL.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-heading.tsx
var TagName = "h1";
var useMenuHeading = createHook(
  function useMenuHeading2(props) {
    props = useHovercardHeading(props);
    return props;
  }
);
var MenuHeading = forwardRef(function MenuHeading2(props) {
  const htmlProps = useMenuHeading(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuHeading,
  useMenuHeading
};
