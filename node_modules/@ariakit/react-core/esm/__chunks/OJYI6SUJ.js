"use client";
import {
  useSelectContext
} from "./AEGCXJZV.js";
import {
  useCompositeStoreProps
} from "./IQYAUKXT.js";
import {
  useComboboxContext
} from "./CVCFNOHX.js";
import {
  useStore,
  useStoreProps
} from "./Q5W46E73.js";
import {
  useUpdateEffect
} from "./KPHZR4MB.js";

// src/tab/tab-store.ts
import * as Core from "@ariakit/core/tab/tab-store";
import { useMemo } from "react";
function useTabStoreProps(store, update, props) {
  useUpdateEffect(update, [props.composite, props.combobox]);
  store = useCompositeStoreProps(store, update, props);
  useStoreProps(store, props, "selectedId", "setSelectedId");
  useStoreProps(store, props, "selectOnMove");
  const [panels, updatePanels] = useStore(() => store.panels, {});
  useUpdateEffect(updatePanels, [store, updatePanels]);
  return Object.assign(
    useMemo(() => ({ ...store, panels }), [store, panels]),
    { composite: props.composite, combobox: props.combobox }
  );
}
function useTabStore(props = {}) {
  const combobox = useComboboxContext();
  const composite = useSelectContext() || combobox;
  props = {
    ...props,
    composite: props.composite !== void 0 ? props.composite : composite,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  const [store, update] = useStore(Core.createTabStore, props);
  return useTabStoreProps(store, update, props);
}

export {
  useTabStoreProps,
  useTabStore
};
