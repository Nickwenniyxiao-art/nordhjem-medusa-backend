"use client";
import {
  CompositeRowContext,
  useCompositeContext
} from "./AVVXDJMZ.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useId,
  useWrapElement
} from "./KPHZR4MB.js";

// src/composite/composite-row.tsx
import { invariant, removeUndefinedValues } from "@ariakit/core/utils/misc";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useCompositeRow = createHook(
  function useCompositeRow2({
    store,
    "aria-setsize": ariaSetSize,
    "aria-posinset": ariaPosInSet,
    ...props
  }) {
    const context = useCompositeContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "CompositeRow must be wrapped in a Composite component."
    );
    const id = useId(props.id);
    const baseElement = store.useState(
      (state) => state.baseElement || void 0
    );
    const providerValue = useMemo(
      () => ({ id, baseElement, ariaSetSize, ariaPosInSet }),
      [id, baseElement, ariaSetSize, ariaPosInSet]
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(CompositeRowContext.Provider, { value: providerValue, children: element }),
      [providerValue]
    );
    props = { id, ...props };
    return removeUndefinedValues(props);
  }
);
var CompositeRow = forwardRef(function CompositeRow2(props) {
  const htmlProps = useCompositeRow(props);
  return createElement(TagName, htmlProps);
});

export {
  useCompositeRow,
  CompositeRow
};
