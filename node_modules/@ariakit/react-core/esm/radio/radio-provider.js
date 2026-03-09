"use client";
import {
  useRadioStore
} from "../__chunks/EBNR6XRJ.js";
import {
  RadioContextProvider
} from "../__chunks/QOZ6WMRY.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/radio/radio-provider.tsx
import { jsx } from "react/jsx-runtime";
function RadioProvider(props = {}) {
  const store = useRadioStore(props);
  return /* @__PURE__ */ jsx(RadioContextProvider, { value: store, children: props.children });
}
export {
  RadioProvider
};
