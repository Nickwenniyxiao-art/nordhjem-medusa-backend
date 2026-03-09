"use client";
import {
  useMenuScopedContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import {
  useHovercardDismiss
} from "../__chunks/KRCRS7MN.js";
import "../__chunks/QSVZ4NTN.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/OCCHVUS4.js";
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
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-dismiss.tsx
var TagName = "button";
var useMenuDismiss = createHook(
  function useMenuDismiss2({ store, ...props }) {
    const context = useMenuScopedContext();
    store = store || context;
    props = useHovercardDismiss({ store, ...props });
    return props;
  }
);
var MenuDismiss = forwardRef(function MenuDismiss2(props) {
  const htmlProps = useMenuDismiss(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuDismiss,
  useMenuDismiss
};
