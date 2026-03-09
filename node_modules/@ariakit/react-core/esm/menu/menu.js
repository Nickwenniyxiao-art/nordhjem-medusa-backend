"use client";
import {
  useMenuList
} from "../__chunks/SVHPDYU7.js";
import {
  useHovercard
} from "../__chunks/4HTVKX2Y.js";
import "../__chunks/X7QOZUD3.js";
import {
  useMenuProviderContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/FORDJ4GP.js";
import "../__chunks/KW7Z5AIL.js";
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
import "../__chunks/6B3RXHKP.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/JG4VNI52.js";
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
import {
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu.tsx
import { fireEvent } from "@ariakit/core/utils/events";
import { hasFocusWithin } from "@ariakit/core/utils/focus";
import { invariant, isFalsyBooleanCallback } from "@ariakit/core/utils/misc";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
var TagName = "div";
var useMenu = createHook(function useMenu2({
  store,
  modal: modalProp = false,
  portal = !!modalProp,
  hideOnEscape = true,
  autoFocusOnShow = true,
  hideOnHoverOutside,
  alwaysVisible,
  ...props
}) {
  const context = useMenuProviderContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "Menu must receive a `store` prop or be wrapped in a MenuProvider component."
  );
  const ref = useRef(null);
  const parentMenu = store.parent;
  const parentMenubar = store.menubar;
  const hasParentMenu = !!parentMenu;
  const parentIsMenubar = !!parentMenubar && !hasParentMenu;
  props = {
    ...props,
    ref: useMergeRefs(ref, props.ref)
  };
  const { "aria-labelledby": ariaLabelledBy, ...menuListProps } = useMenuList({
    store,
    alwaysVisible,
    ...props
  });
  props = menuListProps;
  const [initialFocusRef, setInitialFocusRef] = useState();
  const autoFocusOnShowState = store.useState("autoFocusOnShow");
  const initialFocus = store.useState("initialFocus");
  const baseElement = store.useState("baseElement");
  const items = store.useState("renderedItems");
  useEffect(() => {
    let cleaning = false;
    setInitialFocusRef((prevInitialFocusRef) => {
      var _a, _b, _c;
      if (cleaning) return;
      if (!autoFocusOnShowState) return;
      if ((_a = prevInitialFocusRef == null ? void 0 : prevInitialFocusRef.current) == null ? void 0 : _a.isConnected) return prevInitialFocusRef;
      const ref2 = createRef();
      switch (initialFocus) {
        // TODO: Refactor
        case "first":
          ref2.current = ((_b = items.find((item) => !item.disabled && item.element)) == null ? void 0 : _b.element) || null;
          break;
        case "last":
          ref2.current = ((_c = [...items].reverse().find((item) => !item.disabled && item.element)) == null ? void 0 : _c.element) || null;
          break;
        default:
          ref2.current = baseElement;
      }
      return ref2;
    });
    return () => {
      cleaning = true;
    };
  }, [store, autoFocusOnShowState, initialFocus, items, baseElement]);
  const modal = hasParentMenu ? false : modalProp;
  const mayAutoFocusOnShow = !!autoFocusOnShow;
  const canAutoFocusOnShow = !!initialFocusRef || !!props.initialFocus || !!modal;
  const contentElement = useStoreState(
    store.combobox || store,
    "contentElement"
  );
  const parentContentElement = useStoreState(
    (parentMenu == null ? void 0 : parentMenu.combobox) || parentMenu,
    "contentElement"
  );
  const preserveTabOrderAnchor = useMemo(() => {
    if (!parentContentElement) return;
    if (!contentElement) return;
    const role = contentElement.getAttribute("role");
    const parentRole = parentContentElement.getAttribute("role");
    const parentIsMenuOrMenubar = parentRole === "menu" || parentRole === "menubar";
    if (parentIsMenuOrMenubar && role === "menu") return;
    return parentContentElement;
  }, [contentElement, parentContentElement]);
  if (preserveTabOrderAnchor !== void 0) {
    props = {
      preserveTabOrderAnchor,
      ...props
    };
  }
  props = useHovercard({
    store,
    alwaysVisible,
    initialFocus: initialFocusRef,
    autoFocusOnShow: mayAutoFocusOnShow ? canAutoFocusOnShow && autoFocusOnShow : autoFocusOnShowState || !!modal,
    ...props,
    hideOnEscape(event) {
      if (isFalsyBooleanCallback(hideOnEscape, event)) return false;
      store == null ? void 0 : store.hideAll();
      return true;
    },
    hideOnHoverOutside(event) {
      const disclosureElement = store == null ? void 0 : store.getState().disclosureElement;
      const getHideOnHoverOutside = () => {
        if (typeof hideOnHoverOutside === "function") {
          return hideOnHoverOutside(event);
        }
        if (hideOnHoverOutside != null) return hideOnHoverOutside;
        if (hasParentMenu) return true;
        if (!parentIsMenubar) return false;
        if (!disclosureElement) return true;
        if (hasFocusWithin(disclosureElement)) return false;
        return true;
      };
      if (!getHideOnHoverOutside()) return false;
      if (event.defaultPrevented) return true;
      if (!hasParentMenu) return true;
      if (!disclosureElement) return true;
      fireEvent(disclosureElement, "mouseout", event);
      if (!hasFocusWithin(disclosureElement)) return true;
      requestAnimationFrame(() => {
        if (hasFocusWithin(disclosureElement)) return;
        store == null ? void 0 : store.hide();
      });
      return false;
    },
    modal,
    portal,
    backdrop: hasParentMenu ? false : props.backdrop
  });
  props = {
    "aria-labelledby": ariaLabelledBy,
    ...props
  };
  return props;
});
var Menu = createDialogComponent(
  forwardRef(function Menu2(props) {
    const htmlProps = useMenu(props);
    return createElement(TagName, htmlProps);
  }),
  useMenuProviderContext
);
export {
  Menu,
  useMenu
};
