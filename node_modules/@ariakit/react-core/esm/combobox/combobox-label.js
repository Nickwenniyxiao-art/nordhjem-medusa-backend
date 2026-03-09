"use client";
import {
  useComboboxProviderContext
} from "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/combobox/combobox-label.tsx
import { invariant, removeUndefinedValues } from "@ariakit/core/utils/misc";
var TagName = "label";
var useComboboxLabel = createHook(
  function useComboboxLabel2({ store, ...props }) {
    const context = useComboboxProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "ComboboxLabel must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const comboboxId = store.useState((state) => {
      var _a;
      return (_a = state.baseElement) == null ? void 0 : _a.id;
    });
    props = {
      htmlFor: comboboxId,
      ...props
    };
    return removeUndefinedValues(props);
  }
);
var ComboboxLabel = memo(
  forwardRef(function ComboboxLabel2(props) {
    const htmlProps = useComboboxLabel(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  ComboboxLabel,
  useComboboxLabel
};
