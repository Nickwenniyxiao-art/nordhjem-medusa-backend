"use client";
import {
  useMenuContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import {
  usePopoverArrow
} from "../__chunks/QKVSMXME.js";
import "../__chunks/2SM3RB2N.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-arrow.tsx
var TagName = "div";
var useMenuArrow = createHook(
  function useMenuArrow2({ store, ...props }) {
    const context = useMenuContext();
    store = store || context;
    return usePopoverArrow({ store, ...props });
  }
);
var MenuArrow = forwardRef(function MenuArrow2(props) {
  const htmlProps = useMenuArrow(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuArrow,
  useMenuArrow
};
