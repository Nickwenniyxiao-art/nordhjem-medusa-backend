"use client";
import {
  useFormControl
} from "../__chunks/YST7RWT5.js";
import "../__chunks/BQYVKXYL.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-field.tsx
var TagName = "input";
var useFormField = createHook(
  function useFormField2(props) {
    return useFormControl(props);
  }
);
var FormField = memo(
  forwardRef(function FormField2(props) {
    const htmlProps = useFormField(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  FormField,
  useFormField
};
