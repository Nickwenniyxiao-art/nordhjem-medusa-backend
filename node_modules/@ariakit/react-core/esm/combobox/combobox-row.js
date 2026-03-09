"use client";
import {
  useCompositeRow
} from "../__chunks/HLPY2PXK.js";
import {
  useComboboxScopedContext
} from "../__chunks/CVCFNOHX.js";
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

// src/combobox/combobox-row.tsx
import { getPopupRole } from "@ariakit/core/utils/dom";
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "div";
var useComboboxRow = createHook(
  function useComboboxRow2({ store, ...props }) {
    const context = useComboboxScopedContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "ComboboxRow must be wrapped in a ComboboxList or ComboboxPopover component"
    );
    const contentElement = store.useState("contentElement");
    const popupRole = getPopupRole(contentElement);
    const role = popupRole === "grid" ? "row" : "presentation";
    props = { role, ...props };
    props = useCompositeRow({ store, ...props });
    return props;
  }
);
var ComboboxRow = forwardRef(function ComboboxRow2(props) {
  const htmlProps = useComboboxRow(props);
  return createElement(TagName, htmlProps);
});
export {
  ComboboxRow,
  useComboboxRow
};
