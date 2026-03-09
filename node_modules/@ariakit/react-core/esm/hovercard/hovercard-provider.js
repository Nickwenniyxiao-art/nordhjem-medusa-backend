"use client";
import {
  useHovercardStore
} from "../__chunks/ECBEZ4YM.js";
import {
  HovercardContextProvider
} from "../__chunks/PTRWAQFT.js";
import "../__chunks/B6FLPFJM.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/hovercard/hovercard-provider.tsx
import { jsx } from "react/jsx-runtime";
function HovercardProvider(props = {}) {
  const store = useHovercardStore(props);
  return /* @__PURE__ */ jsx(HovercardContextProvider, { value: store, children: props.children });
}
export {
  HovercardProvider
};
