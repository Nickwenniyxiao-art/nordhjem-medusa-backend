"use client";
import {
  usePopoverStoreProps
} from "./B6FLPFJM.js";
import {
  useCompositeStoreOptions,
  useCompositeStoreProps
} from "./IQYAUKXT.js";
import {
  useComboboxProviderContext
} from "./CVCFNOHX.js";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";
import {
  useUpdateEffect
} from "./KPHZR4MB.js";

// src/select/select-store.ts
import * as Core from "@ariakit/core/select/select-store";
function useSelectStoreOptions(props) {
  const combobox = useComboboxProviderContext();
  props = {
    ...props,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  return useCompositeStoreOptions(props);
}
function useSelectStoreProps(store, update, props) {
  useUpdateEffect(update, [props.combobox]);
  useStoreProps(store, props, "value", "setValue");
  useStoreProps(store, props, "setValueOnMove");
  return Object.assign(
    usePopoverStoreProps(
      useCompositeStoreProps(store, update, props),
      update,
      props
    ),
    { combobox: props.combobox }
  );
}
function useSelectStore(props = {}) {
  props = useSelectStoreOptions(props);
  const [store, update] = useStore(Core.createSelectStore, props);
  return useSelectStoreProps(store, update, props);
}

export {
  useSelectStoreOptions,
  useSelectStoreProps,
  useSelectStore
};
