"use client";
import {
  useFormContext
} from "../__chunks/BQYVKXYL.js";
import {
  useCollectionItem
} from "../__chunks/Z2O3VLAQ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useId,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/form/form-error.tsx
import { invariant } from "@ariakit/core/utils/misc";
import { useCallback, useRef } from "react";
var TagName = "div";
var useFormError = createHook(
  function useFormError2({
    store,
    name: nameProp,
    getItem: getItemProp,
    ...props
  }) {
    const context = useFormContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "FormError must be wrapped in a Form component."
    );
    const id = useId(props.id);
    const ref = useRef(null);
    const name = `${nameProp}`;
    const getItem = useCallback(
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "error" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp]
    );
    const children = store.useState(() => {
      const error = store == null ? void 0 : store.getError(name);
      if (error == null) return;
      if (!(store == null ? void 0 : store.getFieldTouched(name))) return;
      return error;
    });
    props = {
      id,
      role: "alert",
      children,
      ...props,
      ref: useMergeRefs(ref, props.ref)
    };
    props = useCollectionItem({ store, ...props, getItem });
    return props;
  }
);
var FormError = memo(
  forwardRef(function FormError2(props) {
    const htmlProps = useFormError(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  FormError,
  useFormError
};
