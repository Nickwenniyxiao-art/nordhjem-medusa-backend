"use client";
import {
  useCheckboxStore
} from "../__chunks/ALZMXNL4.js";
import {
  CheckboxContextProvider
} from "../__chunks/ZVXT4QFT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/checkbox/checkbox-provider.tsx
import { jsx } from "react/jsx-runtime";
function CheckboxProvider(props = {}) {
  const store = useCheckboxStore(props);
  return /* @__PURE__ */ jsx(CheckboxContextProvider, { value: store, children: props.children });
}
export {
  CheckboxProvider
};
