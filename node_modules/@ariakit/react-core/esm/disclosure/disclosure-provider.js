"use client";
import {
  useDisclosureStore
} from "../__chunks/WLZ6H5FH.js";
import {
  DisclosureContextProvider
} from "../__chunks/LVDQFHCH.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/disclosure/disclosure-provider.tsx
import { jsx } from "react/jsx-runtime";
function DisclosureProvider(props = {}) {
  const store = useDisclosureStore(props);
  return /* @__PURE__ */ jsx(DisclosureContextProvider, { value: store, children: props.children });
}
export {
  DisclosureProvider
};
