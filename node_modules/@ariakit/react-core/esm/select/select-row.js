"use client";
import {
  useSelectContext
} from "../__chunks/AEGCXJZV.js";
import {
  useCompositeRow
} from "../__chunks/HLPY2PXK.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-row.tsx
import { getPopupRole } from "@ariakit/core/utils/dom";
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "div";
var useSelectRow = createHook(
  function useSelectRow2({ store, ...props }) {
    const context = useSelectContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "SelectRow must be wrapped in a SelectList or SelectPopover component"
    );
    const listElement = store.useState("listElement");
    const popupRole = getPopupRole(listElement);
    const role = popupRole === "grid" ? "row" : "presentation";
    props = { role, ...props };
    props = useCompositeRow({ store, ...props });
    return props;
  }
);
var SelectRow = forwardRef(function SelectRow2(props) {
  const htmlProps = useSelectRow(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectRow,
  useSelectRow
};
