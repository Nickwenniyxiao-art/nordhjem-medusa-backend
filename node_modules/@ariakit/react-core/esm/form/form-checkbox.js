"use client";
import {
  useFormControl
} from "../__chunks/YST7RWT5.js";
import {
  useFormContext
} from "../__chunks/BQYVKXYL.js";
import "../__chunks/Z2O3VLAQ.js";
import {
  useCheckboxStore
} from "../__chunks/ALZMXNL4.js";
import {
  useCheckbox
} from "../__chunks/I7KWAPMF.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/EYKMH5G5.js";
import "../__chunks/ZVXT4QFT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-checkbox.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "input";
var useFormCheckbox = createHook(
  function useFormCheckbox2({
    store,
    name: nameProp,
    value,
    checked,
    defaultChecked,
    ...props
  }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormCheckbox must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const checkboxStore = useCheckboxStore({
      value: store.useValue(name),
      setValue: (value2) => store == null ? void 0 : store.setValue(name, value2)
    });
    props = useCheckbox({ store: checkboxStore, value, checked, ...props });
    props = useFormControl({
      store,
      name,
      "aria-labelledby": void 0,
      ...props
    });
    return props;
  }
);
var FormCheckbox = memo(
  forwardRef(function FormCheckbox2(props) {
    const htmlProps = useFormCheckbox(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  FormCheckbox,
  useFormCheckbox
};
