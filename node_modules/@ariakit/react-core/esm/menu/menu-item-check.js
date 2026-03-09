"use client";
import {
  MenuItemCheckedContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import {
  useCheckboxCheck
} from "../__chunks/HOITXJDS.js";
import "../__chunks/EYKMH5G5.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-item-check.tsx
import { useContext } from "react";
var TagName = "span";
var useMenuItemCheck = createHook(
  function useMenuItemCheck2({ store, checked, ...props }) {
    const context = useContext(MenuItemCheckedContext);
    checked = checked != null ? checked : context;
    props = useCheckboxCheck({ ...props, checked });
    return props;
  }
);
var MenuItemCheck = forwardRef(function MenuItemCheck2(props) {
  const htmlProps = useMenuItemCheck(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuItemCheck,
  useMenuItemCheck
};
