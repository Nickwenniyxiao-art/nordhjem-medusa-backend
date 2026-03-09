"use client";
import {
  usePopoverDismiss
} from "./QSVZ4NTN.js";
import {
  useHovercardScopedContext
} from "./PTRWAQFT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/hovercard/hovercard-dismiss.tsx
var TagName = "button";
var useHovercardDismiss = createHook(
  function useHovercardDismiss2({ store, ...props }) {
    const context = useHovercardScopedContext();
    store = store || context;
    props = usePopoverDismiss({ store, ...props });
    return props;
  }
);
var HovercardDismiss = forwardRef(function HovercardDismiss2(props) {
  const htmlProps = useHovercardDismiss(props);
  return createElement(TagName, htmlProps);
});

export {
  useHovercardDismiss,
  HovercardDismiss
};
