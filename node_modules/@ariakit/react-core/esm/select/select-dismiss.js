"use client";
import {
  useSelectScopedContext
} from "../__chunks/AEGCXJZV.js";
import {
  usePopoverDismiss
} from "../__chunks/QSVZ4NTN.js";
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

// src/select/select-dismiss.tsx
var TagName = "button";
var useSelectDismiss = createHook(
  function useSelectDismiss2({ store, ...props }) {
    const context = useSelectScopedContext();
    store = store || context;
    props = usePopoverDismiss({ store, ...props });
    return props;
  }
);
var SelectDismiss = forwardRef(function SelectDismiss2(props) {
  const htmlProps = useSelectDismiss(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectDismiss,
  useSelectDismiss
};
