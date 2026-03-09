"use client";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";
import {
  useUpdateEffect
} from "./KPHZR4MB.js";

// src/collection/collection-store.ts
import * as Core from "@ariakit/core/collection/collection-store";
function useCollectionStoreProps(store, update, props) {
  useUpdateEffect(update, [props.store]);
  useStoreProps(store, props, "items", "setItems");
  return store;
}
function useCollectionStore(props = {}) {
  const [store, update] = useStore(Core.createCollectionStore, props);
  return useCollectionStoreProps(store, update, props);
}

export {
  useCollectionStoreProps,
  useCollectionStore
};
