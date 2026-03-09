"use client";
import {
  usePopoverProviderContext
} from "./JMU4N4M5.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useMergeRefs
} from "./KPHZR4MB.js";

// src/popover/popover-anchor.tsx
var TagName = "div";
var usePopoverAnchor = createHook(
  function usePopoverAnchor2({ store, ...props }) {
    const context = usePopoverProviderContext();
    store = store || context;
    props = {
      ...props,
      ref: useMergeRefs(store == null ? void 0 : store.setAnchorElement, props.ref)
    };
    return props;
  }
);
var PopoverAnchor = forwardRef(function PopoverAnchor2(props) {
  const htmlProps = usePopoverAnchor(props);
  return createElement(TagName, htmlProps);
});

export {
  usePopoverAnchor,
  PopoverAnchor
};
