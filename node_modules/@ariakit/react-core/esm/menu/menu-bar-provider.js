"use client";
import {
  MenubarProvider
} from "../__chunks/XAV7ZXSW.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/6H6PBGDB.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-bar-provider.tsx
import { useEffect } from "react";
import { jsx } from "react/jsx-runtime";
function MenuBarProvider(props = {}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "MenuBarProvider is deprecated. Use MenubarProvider instead.",
        "See https://ariakit.org/reference/menubar-provider"
      );
    }
  }, []);
  return /* @__PURE__ */ jsx(MenubarProvider, { ...props });
}
export {
  MenuBarProvider
};
