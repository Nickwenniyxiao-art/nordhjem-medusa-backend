"use client";
import {
  useCompositeGroup
} from "../__chunks/XXOHUFXO.js";
import "../__chunks/Y6I7WX7H.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-group.tsx
var TagName = "div";
var useSelectGroup = createHook(
  function useSelectGroup2(props) {
    props = useCompositeGroup(props);
    return props;
  }
);
var SelectGroup = forwardRef(function SelectGroup2(props) {
  const htmlProps = useSelectGroup(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectGroup,
  useSelectGroup
};
