"use client";
import {
  useDialogStoreProps
} from "./4NYSH4UO.js";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";
import {
  useUpdateEffect
} from "./KPHZR4MB.js";

// src/popover/popover-store.ts
import * as Core from "@ariakit/core/popover/popover-store";
function usePopoverStoreProps(store, update, props) {
  useUpdateEffect(update, [props.popover]);
  useStoreProps(store, props, "placement");
  return useDialogStoreProps(store, update, props);
}
function usePopoverStore(props = {}) {
  const [store, update] = useStore(Core.createPopoverStore, props);
  return usePopoverStoreProps(store, update, props);
}

export {
  usePopoverStoreProps,
  usePopoverStore
};
