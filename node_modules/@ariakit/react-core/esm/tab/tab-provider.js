"use client";
import {
  useTabStore
} from "../__chunks/OJYI6SUJ.js";
import {
  TabContextProvider
} from "../__chunks/NF43FNG5.js";
import "../__chunks/AEGCXJZV.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tab/tab-provider.tsx
import { jsx } from "react/jsx-runtime";
function TabProvider(props = {}) {
  const store = useTabStore(props);
  return /* @__PURE__ */ jsx(TabContextProvider, { value: store, children: props.children });
}
export {
  TabProvider
};
