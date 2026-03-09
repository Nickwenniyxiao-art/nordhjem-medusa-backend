"use client";
import {
  useMenubar
} from "../__chunks/OUKAB3Z2.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/6H6PBGDB.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-bar.tsx
import { useEffect } from "react";
var TagName = "div";
var useMenuBar = createHook(
  function useMenuBar2(props) {
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "MenuBar is deprecated. Use Menubar instead.",
          "See https://ariakit.org/reference/menubar"
        );
      }
    }, []);
    return useMenubar(props);
  }
);
var MenuBar = forwardRef(function MenuBar2(props) {
  const htmlProps = useMenuBar(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuBar,
  useMenuBar
};
