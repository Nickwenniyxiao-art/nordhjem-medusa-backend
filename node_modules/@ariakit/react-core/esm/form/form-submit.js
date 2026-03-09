"use client";
import {
  useFormContext
} from "../__chunks/BQYVKXYL.js";
import {
  useButton
} from "../__chunks/HMKTUWOU.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-submit.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "button";
var useFormSubmit = createHook(
  function useFormSubmit2({ store, accessibleWhenDisabled = true, ...props }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormSubmit must be wrapped in a Form component."
    );
    props = {
      type: "submit",
      disabled: store.useState("submitting"),
      ...props
    };
    props = useButton({ ...props, accessibleWhenDisabled });
    return props;
  }
);
var FormSubmit = forwardRef(function FormSubmit2(props) {
  const htmlProps = useFormSubmit(props);
  return createElement(TagName, htmlProps);
});
export {
  FormSubmit,
  useFormSubmit
};
