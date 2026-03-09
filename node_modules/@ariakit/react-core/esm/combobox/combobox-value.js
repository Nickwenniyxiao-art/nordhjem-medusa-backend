"use client";
import {
  useComboboxContext
} from "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/combobox/combobox-value.tsx
import { invariant } from "@ariakit/core/utils/misc";
function ComboboxValue({ store, children } = {}) {
  const context = useComboboxContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "ComboboxValue must receive a `store` prop or be wrapped in a ComboboxProvider component."
  );
  const value = store.useState("value");
  if (children) {
    return children(value);
  }
  return value;
}
export {
  ComboboxValue
};
