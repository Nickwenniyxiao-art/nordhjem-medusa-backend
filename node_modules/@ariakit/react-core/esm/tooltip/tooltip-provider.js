"use client";
import {
  useTooltipStore
} from "../__chunks/FFWYDZCP.js";
import {
  TooltipContextProvider
} from "../__chunks/UZXQ5DX3.js";
import "../__chunks/ECBEZ4YM.js";
import "../__chunks/PTRWAQFT.js";
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

// src/tooltip/tooltip-provider.tsx
import { jsx } from "react/jsx-runtime";
function TooltipProvider(props = {}) {
  const store = useTooltipStore(props);
  return /* @__PURE__ */ jsx(TooltipContextProvider, { value: store, children: props.children });
}
export {
  TooltipProvider
};
