"use client";
import {
  useRadio
} from "../__chunks/5TKKKQCL.js";
import "../__chunks/QOZ6WMRY.js";
import {
  useFormControl
} from "../__chunks/YST7RWT5.js";
import {
  useFormContext
} from "../__chunks/BQYVKXYL.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
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

// src/form/form-radio.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "input";
var useFormRadio = createHook(
  function useFormRadio2({ store, name: nameProp, value, ...props }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormRadio must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const onChangeProp = props.onChange;
    const onChange = useEvent((event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setValue(name, value);
    });
    const checkedProp = props.checked;
    const checked = store.useState(
      () => checkedProp != null ? checkedProp : (store == null ? void 0 : store.getValue(name)) === value
    );
    props = {
      ...props,
      checked,
      onChange
    };
    props = useRadio({ value, ...props });
    props = useFormControl({
      store,
      name,
      "aria-labelledby": void 0,
      ...props
    });
    return props;
  }
);
var FormRadio = memo(
  forwardRef(function FormRadio2(props) {
    const htmlProps = useFormRadio(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  FormRadio,
  useFormRadio
};
