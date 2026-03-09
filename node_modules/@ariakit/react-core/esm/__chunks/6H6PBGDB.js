"use client";
import {
  useCompositeStoreProps
} from "./IQYAUKXT.js";
import {
  useStore
} from "./Q5W46E73.js";

// src/menubar/menubar-store.ts
import * as Core from "@ariakit/core/menubar/menubar-store";
function useMenubarStoreProps(store, update, props) {
  return useCompositeStoreProps(store, update, props);
}
function useMenubarStore(props = {}) {
  const [store, update] = useStore(Core.createMenubarStore, props);
  return useMenubarStoreProps(store, update, props);
}

export {
  useMenubarStoreProps,
  useMenubarStore
};
