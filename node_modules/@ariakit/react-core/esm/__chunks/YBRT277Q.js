"use client";
import {
  useSeparator
} from "./P7VC6T3R.js";
import {
  useCompositeContext
} from "./AVVXDJMZ.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/composite/composite-separator.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "hr";
var useCompositeSeparator = createHook(function useCompositeSeparator2({ store, ...props }) {
  const context = useCompositeContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "CompositeSeparator must be wrapped in a Composite component."
  );
  const orientation = store.useState(
    (state) => state.orientation === "horizontal" ? "vertical" : "horizontal"
  );
  props = useSeparator({ ...props, orientation });
  return props;
});
var CompositeSeparator = forwardRef(function CompositeSeparator2(props) {
  const htmlProps = useCompositeSeparator(props);
  return createElement(TagName, htmlProps);
});

export {
  useCompositeSeparator,
  CompositeSeparator
};
