"use client";
import {
  usePopover
} from "../__chunks/KW7Z5AIL.js";
import {
  createDialogComponent
} from "../__chunks/Z32PU2LQ.js";
import "../__chunks/VJH3F6TN.js";
import "../__chunks/AOQQTIBO.js";
import "../__chunks/5M6RIVE2.js";
import "../__chunks/BFOIJXK2.js";
import "../__chunks/2F57YTN4.js";
import "../__chunks/3HM4TGWW.js";
import "../__chunks/6GXEOXGT.js";
import "../__chunks/KKITJVHA.js";
import "../__chunks/U3R3WHDK.js";
import "../__chunks/JSI7U3EA.js";
import "../__chunks/B6W4QFKS.js";
import "../__chunks/OT5RJDXG.js";
import "../__chunks/CZ4GFWYL.js";
import "../__chunks/Z5GCVBAY.js";
import "../__chunks/IGR4SXG2.js";
import "../__chunks/677M2CI3.js";
import "../__chunks/S7U6BLGA.js";
import "../__chunks/P45QRJLH.js";
import "../__chunks/3NDVDEB4.js";
import "../__chunks/AOUGVQZ3.js";
import "../__chunks/K2ZF5NU7.js";
import "../__chunks/63XF7ACK.js";
import {
  useComboboxList
} from "../__chunks/2G6YEJT4.js";
import "../__chunks/6B3RXHKP.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/JG4VNI52.js";
import {
  useComboboxProviderContext
} from "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import {
  useStoreState
} from "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/combobox/combobox-popover.tsx
import { getDocument } from "@ariakit/core/utils/dom";
import { invariant, isFalsyBooleanCallback } from "@ariakit/core/utils/misc";
import { useRef } from "react";
var TagName = "div";
function isController(target, ...ids) {
  if (!target) return false;
  if ("id" in target) {
    const selector = ids.filter(Boolean).map((id) => `[aria-controls~="${id}"]`).join(", ");
    if (!selector) return false;
    return target.matches(selector);
  }
  return false;
}
var useComboboxPopover = createHook(
  function useComboboxPopover2({
    store,
    modal,
    tabIndex,
    alwaysVisible,
    autoFocusOnHide = true,
    hideOnInteractOutside = true,
    ...props
  }) {
    const context = useComboboxProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "ComboboxPopover must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const baseElement = store.useState("baseElement");
    const hiddenByClickOutsideRef = useRef(false);
    const treeSnapshotKey = useStoreState(
      store.tag,
      (state) => state == null ? void 0 : state.renderedItems.length
    );
    props = useComboboxList({ store, alwaysVisible, ...props });
    props = usePopover({
      store,
      modal,
      alwaysVisible,
      backdrop: false,
      autoFocusOnShow: false,
      finalFocus: baseElement,
      preserveTabOrderAnchor: null,
      unstable_treeSnapshotKey: treeSnapshotKey,
      ...props,
      // When the combobox popover is modal, we make sure to include the
      // combobox input and all the combobox controls (cancel, disclosure) in
      // the list of persistent elements so they make part of the modal context,
      // allowing users to tab through them.
      getPersistentElements() {
        var _a;
        const elements = ((_a = props.getPersistentElements) == null ? void 0 : _a.call(props)) || [];
        if (!modal) return elements;
        if (!store) return elements;
        const { contentElement, baseElement: baseElement2 } = store.getState();
        if (!baseElement2) return elements;
        const doc = getDocument(baseElement2);
        const selectors = [];
        if (contentElement == null ? void 0 : contentElement.id) {
          selectors.push(`[aria-controls~="${contentElement.id}"]`);
        }
        if (baseElement2 == null ? void 0 : baseElement2.id) {
          selectors.push(`[aria-controls~="${baseElement2.id}"]`);
        }
        if (!selectors.length) return [...elements, baseElement2];
        const selector = selectors.join(",");
        const controlElements = doc.querySelectorAll(selector);
        return [...elements, ...controlElements];
      },
      // The combobox popover should focus on the combobox input when it hides,
      // unless the event was triggered by a click outside the popover, in which
      // case the input shouldn't be re-focused.
      autoFocusOnHide(element) {
        if (isFalsyBooleanCallback(autoFocusOnHide, element)) return false;
        if (hiddenByClickOutsideRef.current) {
          hiddenByClickOutsideRef.current = false;
          return false;
        }
        return true;
      },
      // Make sure we don't hide the popover when the user interacts with the
      // combobox cancel or the combobox disclosure buttons. They will have the
      // aria-controls attribute pointing to either the combobox input or the
      // combobox popover elements.
      hideOnInteractOutside(event) {
        var _a, _b;
        const state = store == null ? void 0 : store.getState();
        const contentId = (_a = state == null ? void 0 : state.contentElement) == null ? void 0 : _a.id;
        const baseId = (_b = state == null ? void 0 : state.baseElement) == null ? void 0 : _b.id;
        if (isController(event.target, contentId, baseId)) return false;
        const result = typeof hideOnInteractOutside === "function" ? hideOnInteractOutside(event) : hideOnInteractOutside;
        if (result) {
          hiddenByClickOutsideRef.current = event.type === "click";
        }
        return result;
      }
    });
    return props;
  }
);
var ComboboxPopover = createDialogComponent(
  forwardRef(function ComboboxPopover2(props) {
    const htmlProps = useComboboxPopover(props);
    return createElement(TagName, htmlProps);
  }),
  useComboboxProviderContext
);
export {
  ComboboxPopover,
  useComboboxPopover
};
