"use client";
import {
  useCompositeStore
} from "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import {
  CompositeContextProvider
} from "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/composite/composite-provider.tsx
import { jsx } from "react/jsx-runtime";
function CompositeProvider(props = {}) {
  const store = useCompositeStore(props);
  return /* @__PURE__ */ jsx(CompositeContextProvider, { value: store, children: props.children });
}
export {
  CompositeProvider
};
