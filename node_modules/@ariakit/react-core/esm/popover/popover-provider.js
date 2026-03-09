"use client";
import {
  usePopoverStore
} from "../__chunks/B6FLPFJM.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import {
  PopoverContextProvider
} from "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/popover/popover-provider.tsx
import { jsx } from "react/jsx-runtime";
function PopoverProvider(props = {}) {
  const store = usePopoverStore(props);
  return /* @__PURE__ */ jsx(PopoverContextProvider, { value: store, children: props.children });
}
export {
  PopoverProvider
};
