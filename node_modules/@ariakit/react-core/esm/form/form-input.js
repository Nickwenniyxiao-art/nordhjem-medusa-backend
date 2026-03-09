"use client";
import {
  useFormControl
} from "../__chunks/YST7RWT5.js";
import {
  useFormContext
} from "../__chunks/BQYVKXYL.js";
import "../__chunks/Z2O3VLAQ.js";
import {
  useFocusable
} from "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-input.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "input";
var useFormInput = createHook(
  function useFormInput2({ store, name: nameProp, ...props }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormInput must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const onChangeProp = props.onChange;
    const onChange = useEvent((event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setValue(name, event.target.value);
    });
    const value = store.useValue(name);
    props = {
      value,
      ...props,
      onChange
    };
    props = useFocusable(props);
    props = useFormControl({ store, name, ...props });
    return props;
  }
);
var FormInput = memo(
  forwardRef(function FormInput2(props) {
    const htmlProps = useFormInput(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  FormInput,
  useFormInput
};
