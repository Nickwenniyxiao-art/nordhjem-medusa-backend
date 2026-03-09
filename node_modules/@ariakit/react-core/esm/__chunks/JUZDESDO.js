"use client";
import {
  useGroupLabel
} from "./NH3GYEZ7.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/composite/composite-group-label.tsx
var TagName = "div";
var useCompositeGroupLabel = createHook(function useCompositeGroupLabel2({ store, ...props }) {
  props = useGroupLabel(props);
  return props;
});
var CompositeGroupLabel = forwardRef(function CompositeGroupLabel2(props) {
  const htmlProps = useCompositeGroupLabel(props);
  return createElement(TagName, htmlProps);
});

export {
  useCompositeGroupLabel,
  CompositeGroupLabel
};
