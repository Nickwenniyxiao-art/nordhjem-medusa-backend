"use client";
import {
  useSelectStore
} from "../__chunks/HVWMDOZM.js";
import {
  SelectContextProvider
} from "../__chunks/AEGCXJZV.js";
import "../__chunks/B6FLPFJM.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
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

// src/select/select-provider.tsx
import { jsx } from "react/jsx-runtime";
function SelectProvider(props = {}) {
  const store = useSelectStore(props);
  return /* @__PURE__ */ jsx(SelectContextProvider, { value: store, children: props.children });
}
export {
  SelectProvider
};
