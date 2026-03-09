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

// src/form/form-reset.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "button";
var useFormReset = createHook(
  function useFormReset2({ store, ...props }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormReset must be wrapped in a Form component."
    );
    props = {
      type: "reset",
      disabled: store.useState("submitting"),
      ...props
    };
    props = useButton(props);
    return props;
  }
);
var FormReset = forwardRef(function FormReset2(props) {
  const htmlProps = useFormReset(props);
  return createElement(TagName, htmlProps);
});
export {
  FormReset,
  useFormReset
};
