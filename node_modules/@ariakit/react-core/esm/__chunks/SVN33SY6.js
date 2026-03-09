"use client";
import {
  useTagContext
} from "./XSIEPKGA.js";
import {
  usePopoverStoreProps
} from "./B6FLPFJM.js";
import {
  useCompositeStoreOptions,
  useCompositeStoreProps
} from "./IQYAUKXT.js";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";
import {
  useUpdateEffect
} from "./KPHZR4MB.js";

// src/combobox/combobox-store.ts
import * as Core from "@ariakit/core/combobox/combobox-store";
function useComboboxStoreOptions(props) {
  const tag = useTagContext();
  props = {
    ...props,
    tag: props.tag !== void 0 ? props.tag : tag
  };
  return useCompositeStoreOptions(props);
}
function useComboboxStoreProps(store, update, props) {
  useUpdateEffect(update, [props.tag]);
  useStoreProps(store, props, "value", "setValue");
  useStoreProps(store, props, "selectedValue", "setSelectedValue");
  useStoreProps(store, props, "resetValueOnHide");
  useStoreProps(store, props, "resetValueOnSelect");
  return Object.assign(
    useCompositeStoreProps(
      usePopoverStoreProps(store, update, props),
      update,
      props
    ),
    { tag: props.tag }
  );
}
function useComboboxStore(props = {}) {
  props = useComboboxStoreOptions(props);
  const [store, update] = useStore(Core.createComboboxStore, props);
  return useComboboxStoreProps(store, update, props);
}

export {
  useComboboxStoreOptions,
  useComboboxStoreProps,
  useComboboxStore
};
