"use client";
import {
  useDialogStore
} from "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import {
  DialogContextProvider
} from "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/dialog/dialog-provider.tsx
import { jsx } from "react/jsx-runtime";
function DialogProvider(props = {}) {
  const store = useDialogStore(props);
  return /* @__PURE__ */ jsx(DialogContextProvider, { value: store, children: props.children });
}
export {
  DialogProvider
};
