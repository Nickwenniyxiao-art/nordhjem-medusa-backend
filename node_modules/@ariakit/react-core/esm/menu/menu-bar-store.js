"use client";
import {
  useMenubarStore,
  useMenubarStoreProps
} from "../__chunks/6H6PBGDB.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-bar-store.ts
import { useEffect } from "react";
function useMenuBarStoreProps(store, update, props) {
  return useMenubarStoreProps(store, update, props);
}
function useMenuBarStore(props = {}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "useMenuBarStore is deprecated. Use useMenubarStore instead.",
        "See https://ariakit.org/reference/use-menubar-store"
      );
    }
  }, []);
  return useMenubarStore(props);
}
export {
  useMenuBarStore,
  useMenuBarStoreProps
};
