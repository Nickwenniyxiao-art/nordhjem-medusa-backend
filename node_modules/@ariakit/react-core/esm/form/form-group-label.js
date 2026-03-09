"use client";
import {
  useGroupLabel
} from "../__chunks/NH3GYEZ7.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-group-label.tsx
var TagName = "div";
var useFormGroupLabel = createHook(
  function useFormGroupLabel2({ store, ...props }) {
    props = useGroupLabel(props);
    return props;
  }
);
var FormGroupLabel = forwardRef(function FormGroupLabel2(props) {
  const htmlProps = useFormGroupLabel(props);
  return createElement(TagName, htmlProps);
});
export {
  FormGroupLabel,
  useFormGroupLabel
};
