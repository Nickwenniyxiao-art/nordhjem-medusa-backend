"use client";
import {
  useDialogDismiss
} from "./OCCHVUS4.js";
import {
  usePopoverScopedContext
} from "./JMU4N4M5.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/popover/popover-dismiss.tsx
var TagName = "button";
var usePopoverDismiss = createHook(
  function usePopoverDismiss2({ store, ...props }) {
    const context = usePopoverScopedContext();
    store = store || context;
    props = useDialogDismiss({ store, ...props });
    return props;
  }
);
var PopoverDismiss = forwardRef(function PopoverDismiss2(props) {
  const htmlProps = usePopoverDismiss(props);
  return createElement(TagName, htmlProps);
});

export {
  usePopoverDismiss,
  PopoverDismiss
};
