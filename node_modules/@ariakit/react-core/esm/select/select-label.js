"use client";
import {
  useSelectProviderContext
} from "../__chunks/AEGCXJZV.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent,
  useId,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-label.tsx
import { invariant, removeUndefinedValues } from "@ariakit/core/utils/misc";
var TagName = "div";
var useSelectLabel = createHook(
  function useSelectLabel2({ store, ...props }) {
    const context = useSelectProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "SelectLabel must receive a `store` prop or be wrapped in a SelectProvider component."
    );
    const id = useId(props.id);
    const onClickProp = props.onClick;
    const onClick = useEvent((event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      queueMicrotask(() => {
        const select = store == null ? void 0 : store.getState().selectElement;
        select == null ? void 0 : select.focus();
      });
    });
    props = {
      id,
      ...props,
      ref: useMergeRefs(store.setLabelElement, props.ref),
      onClick,
      style: {
        cursor: "default",
        ...props.style
      }
    };
    return removeUndefinedValues(props);
  }
);
var SelectLabel = memo(
  forwardRef(function SelectLabel2(props) {
    const htmlProps = useSelectLabel(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  SelectLabel,
  useSelectLabel
};
