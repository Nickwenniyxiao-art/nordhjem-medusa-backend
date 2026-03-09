"use client";
import {
  useHovercardStoreProps
} from "./ECBEZ4YM.js";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";

// src/tooltip/tooltip-store.ts
import * as Core from "@ariakit/core/tooltip/tooltip-store";
function useTooltipStoreProps(store, update, props) {
  useStoreProps(store, props, "type");
  useStoreProps(store, props, "skipTimeout");
  return useHovercardStoreProps(store, update, props);
}
function useTooltipStore(props = {}) {
  const [store, update] = useStore(Core.createTooltipStore, props);
  return useTooltipStoreProps(store, update, props);
}

export {
  useTooltipStoreProps,
  useTooltipStore
};
