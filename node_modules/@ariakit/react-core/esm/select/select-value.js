"use client";
import {
  useSelectContext
} from "../__chunks/AEGCXJZV.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import {
  useStoreState
} from "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-value.tsx
function SelectValue({
  store,
  fallback,
  children
} = {}) {
  const context = useSelectContext();
  store = store || context;
  const value = useStoreState(store, (state) => {
    if (!(state == null ? void 0 : state.value.length)) return fallback;
    return state.value;
  });
  if (children) {
    return children(value || "");
  }
  return value;
}
export {
  SelectValue
};
