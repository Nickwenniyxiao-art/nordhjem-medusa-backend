"use client";
import {
  useTagStore
} from "../__chunks/FZC6JZLK.js";
import {
  TagContextProvider
} from "../__chunks/XSIEPKGA.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tag/tag-provider.tsx
import { jsx } from "react/jsx-runtime";
function TagProvider(props = {}) {
  const store = useTagStore(props);
  return /* @__PURE__ */ jsx(TagContextProvider, { value: store, children: props.children });
}
export {
  TagProvider
};
