"use client";
import {
  CollectionScopedContextProvider,
  useCollectionProviderContext
} from "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/collection/collection.tsx
import { removeUndefinedValues } from "@ariakit/core/utils/misc";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useCollection = createHook(
  function useCollection2({ store, ...props }) {
    const context = useCollectionProviderContext();
    store = store || context;
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(CollectionScopedContextProvider, { value: store, children: element }),
      [store]
    );
    return removeUndefinedValues(props);
  }
);
var Collection = forwardRef(function Collection2(props) {
  const htmlProps = useCollection(props);
  return createElement(TagName, htmlProps);
});
export {
  Collection,
  useCollection
};
