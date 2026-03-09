"use client";
import {
  useCompositeItemOffscreen
} from "../__chunks/PTR7CZ6Q.js";
import {
  ComboboxItem
} from "../__chunks/IBXZ2LQC.js";
import "../__chunks/X6LNAU2F.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/FMNW3QQI.js";
import {
  Role
} from "../__chunks/JG4VNI52.js";
import "../__chunks/Z2O3VLAQ.js";
import {
  ComboboxListRoleContext,
  useComboboxScopedContext
} from "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/combobox/combobox-item-offscreen.tsx
import { useContext } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var itemRoleByPopupRole = {
  menu: "menuitem",
  listbox: "option",
  tree: "treeitem"
};
function getItemRole(popupRole) {
  var _a;
  const key = popupRole;
  return (_a = itemRoleByPopupRole[key]) != null ? _a : "option";
}
function useComboboxItemOffscreen({ store, value, ...props }) {
  const context = useComboboxScopedContext();
  store = store || context;
  const offscreenProps = useCompositeItemOffscreen({ store, value, ...props });
  const popupRole = useContext(ComboboxListRoleContext);
  if (!offscreenProps.active) {
    return {
      ...offscreenProps,
      role: getItemRole(popupRole)
    };
  }
  return offscreenProps;
}
var ComboboxItem2 = forwardRef(function ComboboxItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useComboboxItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: useMergeRefs(ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ jsx(ComboboxItem, { ...allProps });
  }
  const {
    store,
    value,
    hideOnClick,
    setValueOnClick,
    selectValueOnClick,
    resetValueOnSelect,
    focusOnHover,
    blurOnHoverEnd,
    moveOnKeyPress,
    getItem,
    ...htmlProps
  } = allProps;
  const Component = Role[TagName];
  return /* @__PURE__ */ jsx(Component, { ...htmlProps });
});
export {
  ComboboxItem2 as ComboboxItem,
  useComboboxItemOffscreen
};
