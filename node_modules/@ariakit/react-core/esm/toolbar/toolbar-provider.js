"use client";
import {
  useToolbarStore
} from "../__chunks/5WUV565P.js";
import {
  ToolbarContextProvider
} from "../__chunks/WZDDDI4V.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/toolbar/toolbar-provider.tsx
import { jsx } from "react/jsx-runtime";
function ToolbarProvider(props = {}) {
  const store = useToolbarStore(props);
  return /* @__PURE__ */ jsx(ToolbarContextProvider, { value: store, children: props.children });
}
export {
  ToolbarProvider
};
