"use client";
import {
  useMenuContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import {
  useCompositeSeparator
} from "../__chunks/YBRT277Q.js";
import "../__chunks/P7VC6T3R.js";
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

// src/menu/menu-separator.tsx
var TagName = "hr";
var useMenuSeparator = createHook(
  function useMenuSeparator2({ store, ...props }) {
    const context = useMenuContext();
    store = store || context;
    props = useCompositeSeparator({ store, ...props });
    return props;
  }
);
var MenuSeparator = forwardRef(function MenuSeparator2(props) {
  const htmlProps = useMenuSeparator(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuSeparator,
  useMenuSeparator
};
