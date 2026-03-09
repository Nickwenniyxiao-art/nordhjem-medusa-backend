"use client";
import {
  useTagContext
} from "../__chunks/XSIEPKGA.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tag/tag-value.tsx
import { invariant } from "@ariakit/core/utils/misc";
function TagValue({ store, children } = {}) {
  const context = useTagContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "TagValue must receive a `store` prop or be wrapped in a TagProvider component."
  );
  const value = store.useState("value");
  if (children) {
    return children(value);
  }
  return value;
}
export {
  TagValue
};
