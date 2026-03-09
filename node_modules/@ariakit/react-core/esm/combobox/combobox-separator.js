"use client";
import {
  useCompositeSeparator
} from "../__chunks/YBRT277Q.js";
import "../__chunks/P7VC6T3R.js";
import {
  useComboboxScopedContext
} from "../__chunks/CVCFNOHX.js";
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

// src/combobox/combobox-separator.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "hr";
var useComboboxSeparator = createHook(function useComboboxSeparator2({ store, ...props }) {
  const context = useComboboxScopedContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "ComboboxSeparator must be wrapped in a ComboboxList or ComboboxPopover component."
  );
  props = useCompositeSeparator({ store, ...props });
  return props;
});
var ComboboxSeparator = forwardRef(function ComboboxSeparator2(props) {
  const htmlProps = useComboboxSeparator(props);
  return createElement(TagName, htmlProps);
});
export {
  ComboboxSeparator,
  useComboboxSeparator
};
