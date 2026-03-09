"use client";
import {
  useGroup
} from "./Y6I7WX7H.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/composite/composite-group.tsx
var TagName = "div";
var useCompositeGroup = createHook(
  function useCompositeGroup2({ store, ...props }) {
    props = useGroup(props);
    return props;
  }
);
var CompositeGroup = forwardRef(function CompositeGroup2(props) {
  const htmlProps = useCompositeGroup(props);
  return createElement(TagName, htmlProps);
});

export {
  useCompositeGroup,
  CompositeGroup
};
