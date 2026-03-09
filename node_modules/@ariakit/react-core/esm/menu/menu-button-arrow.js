"use client";
import {
  usePopoverDisclosureArrow
} from "../__chunks/37HM5VRA.js";
import {
  useMenuContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-button-arrow.tsx
var TagName = "span";
var useMenuButtonArrow = createHook(
  function useMenuButtonArrow2({ store, ...props }) {
    const context = useMenuContext();
    store = store || context;
    props = usePopoverDisclosureArrow({ store, ...props });
    return props;
  }
);
var MenuButtonArrow = forwardRef(function MenuButtonArrow2(props) {
  const htmlProps = useMenuButtonArrow(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuButtonArrow,
  useMenuButtonArrow
};
