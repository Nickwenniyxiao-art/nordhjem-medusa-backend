"use client";
import {
  useDisclosureStoreProps
} from "./WLZ6H5FH.js";
import {
  useStore
} from "./Q5W46E73.js";

// src/dialog/dialog-store.ts
import * as Core from "@ariakit/core/dialog/dialog-store";
function useDialogStoreProps(store, update, props) {
  return useDisclosureStoreProps(store, update, props);
}
function useDialogStore(props = {}) {
  const [store, update] = useStore(Core.createDialogStore, props);
  return useDialogStoreProps(store, update, props);
}

export {
  useDialogStoreProps,
  useDialogStore
};
