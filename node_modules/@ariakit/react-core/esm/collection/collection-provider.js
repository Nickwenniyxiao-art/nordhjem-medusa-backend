"use client";
import {
  useCollectionStore
} from "../__chunks/GVAFFF2B.js";
import "../__chunks/Q5W46E73.js";
import {
  CollectionContextProvider
} from "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/collection/collection-provider.tsx
import { jsx } from "react/jsx-runtime";
function CollectionProvider(props = {}) {
  const store = useCollectionStore(props);
  return /* @__PURE__ */ jsx(CollectionContextProvider, { value: store, children: props.children });
}
export {
  CollectionProvider
};
