"use client";
import {
  useSelectContext
} from "./AEGCXJZV.js";
import {
  usePopoverDisclosureArrow
} from "./37HM5VRA.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/select/select-arrow.tsx
var TagName = "span";
var useSelectArrow = createHook(
  function useSelectArrow2({ store, ...props }) {
    const context = useSelectContext();
    store = store || context;
    props = usePopoverDisclosureArrow({ store, ...props });
    return props;
  }
);
var SelectArrow = forwardRef(function SelectArrow2(props) {
  const htmlProps = useSelectArrow(props);
  return createElement(TagName, htmlProps);
});

export {
  useSelectArrow,
  SelectArrow
};
