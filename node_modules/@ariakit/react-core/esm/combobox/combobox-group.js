"use client";
import {
  useCompositeGroup
} from "../__chunks/XXOHUFXO.js";
import "../__chunks/Y6I7WX7H.js";
import "../__chunks/7HVFURXT.js";
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

// src/combobox/combobox-group.tsx
import { getPopupRole } from "@ariakit/core/utils/dom";
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "div";
var useComboboxGroup = createHook(
  function useComboboxGroup2({ store, ...props }) {
    const context = useComboboxScopedContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "ComboboxRow must be wrapped in a ComboboxList or ComboboxPopover component"
    );
    const contentElement = store.useState("contentElement");
    const popupRole = getPopupRole(contentElement);
    if (popupRole === "grid") {
      props = { role: "rowgroup", ...props };
    }
    props = useCompositeGroup({ store, ...props });
    return props;
  }
);
var ComboboxGroup = forwardRef(function ComboboxGroup2(props) {
  const htmlProps = useComboboxGroup(props);
  return createElement(TagName, htmlProps);
});
export {
  ComboboxGroup,
  useComboboxGroup
};
