"use client";
import {
  useSelectContext
} from "../__chunks/AEGCXJZV.js";
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

// src/select/select-separator.tsx
var TagName = "hr";
var useSelectSeparator = createHook(
  function useSelectSeparator2({ store, ...props }) {
    const context = useSelectContext();
    store = store || context;
    props = useCompositeSeparator({ store, ...props });
    return props;
  }
);
var SelectSeparator = forwardRef(function SelectSeparator2(props) {
  const htmlProps = useSelectSeparator(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectSeparator,
  useSelectSeparator
};
