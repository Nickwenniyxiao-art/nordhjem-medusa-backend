"use client";
import {
  useHovercardDescription
} from "../__chunks/O6DAAE7K.js";
import "../__chunks/2TJZ2QHB.js";
import "../__chunks/WHZCNP67.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-description.tsx
var TagName = "p";
var useMenuDescription = createHook(
  function useMenuDescription2(props) {
    props = useHovercardDescription(props);
    return props;
  }
);
var MenuDescription = forwardRef(function MenuDescription2(props) {
  const htmlProps = useMenuDescription(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuDescription,
  useMenuDescription
};
