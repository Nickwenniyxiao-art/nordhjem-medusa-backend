"use client";
import {
  useTagContext
} from "../__chunks/XSIEPKGA.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useId,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tag/tag-list-label.tsx
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "label";
var useTagListLabel = createHook(
  function useTagListLabel2({ store, ...props }) {
    const context = useTagContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "TagListLabel must receive a `store` prop or be wrapped in a TagProvider component."
    );
    const id = useId(props.id);
    const htmlFor = store.useState((state) => {
      var _a;
      return (_a = state.inputElement) == null ? void 0 : _a.id;
    });
    props = {
      id,
      htmlFor,
      ...props,
      ref: useMergeRefs(store.setLabelElement, props.ref)
    };
    return props;
  }
);
var TagListLabel = forwardRef(function TagListLabel2(props) {
  const htmlProps = useTagListLabel(props);
  return createElement(TagName, htmlProps);
});
export {
  TagListLabel,
  useTagListLabel
};
