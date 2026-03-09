"use client";
import {
  useFormStore
} from "../__chunks/MAEE4WWH.js";
import {
  FormContextProvider
} from "../__chunks/BQYVKXYL.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-provider.tsx
import { jsx } from "react/jsx-runtime";
function FormProvider(props = {}) {
  const store = useFormStore(props);
  return /* @__PURE__ */ jsx(FormContextProvider, { value: store, children: props.children });
}
export {
  FormProvider
};
