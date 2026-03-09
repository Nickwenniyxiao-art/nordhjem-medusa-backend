"use client";
import {
  useCompositeGroupLabel
} from "../__chunks/JUZDESDO.js";
import "../__chunks/NH3GYEZ7.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-group-label.tsx
var TagName = "div";
var useSelectGroupLabel = createHook(
  function useSelectGroupLabel2(props) {
    props = useCompositeGroupLabel(props);
    return props;
  }
);
var SelectGroupLabel = forwardRef(function SelectGroupLabel2(props) {
  const htmlProps = useSelectGroupLabel(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectGroupLabel,
  useSelectGroupLabel
};
