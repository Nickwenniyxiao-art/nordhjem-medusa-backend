"use client";
import {
  usePopoverStoreProps
} from "../__chunks/B6FLPFJM.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import {
  useStore
} from "../__chunks/Q5W46E73.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/composite/composite-overflow-store.ts
import * as Core from "@ariakit/core/composite/composite-overflow-store";
function useCompositeOverflowStoreProps(store, update, props) {
  return usePopoverStoreProps(store, update, props);
}
function useCompositeOverflowStore(props = {}) {
  const [store, update] = useStore(Core.createCompositeOverflowStore, props);
  return useCompositeOverflowStoreProps(store, update, props);
}
export {
  useCompositeOverflowStore,
  useCompositeOverflowStoreProps
};
