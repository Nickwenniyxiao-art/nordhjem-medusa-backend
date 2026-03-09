"use client";
import {
  useFormGroup
} from "../__chunks/LPZHRGHO.js";
import "../__chunks/Y6I7WX7H.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-radio-group.tsx
var TagName = "div";
var useFormRadioGroup = createHook(
  function useFormRadioGroup2({ store, ...props }) {
    props = { role: "radiogroup", ...props };
    props = useFormGroup(props);
    return props;
  }
);
var FormRadioGroup = forwardRef(function FormRadioGroup2(props) {
  const htmlProps = useFormRadioGroup(props);
  return createElement(TagName, htmlProps);
});
export {
  FormRadioGroup,
  useFormRadioGroup
};
