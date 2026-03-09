"use client";
import {
  useDialogHeading
} from "./O4VW3LHI.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/popover/popover-heading.tsx
var TagName = "h1";
var usePopoverHeading = createHook(
  function usePopoverHeading2(props) {
    props = useDialogHeading(props);
    return props;
  }
);
var PopoverHeading = forwardRef(function PopoverHeading2(props) {
  const htmlProps = usePopoverHeading(props);
  return createElement(TagName, htmlProps);
});

export {
  usePopoverHeading,
  PopoverHeading
};
