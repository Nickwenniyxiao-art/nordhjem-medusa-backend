"use client";
import {
  useMenuContext
} from "./Z4X7TRJU.js";
import {
  useMenubarContext
} from "./2DUOQURA.js";
import {
  useHovercardStoreProps
} from "./ECBEZ4YM.js";
import {
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

// src/menu/menu-store.ts
import * as Core from "@ariakit/core/menu/menu-store";
function useMenuStoreProps(store, update, props) {
  useUpdateEffect(update, [props.combobox, props.parent, props.menubar]);
  useStoreProps(store, props, "values", "setValues");
  return Object.assign(
    useHovercardStoreProps(
      useCompositeStoreProps(store, update, props),
      update,
      props
    ),
    {
      combobox: props.combobox,
      parent: props.parent,
      menubar: props.menubar
    }
  );
}
function useMenuStore(props = {}) {
  const parent = useMenuContext();
  const menubar = useMenubarContext();
  const combobox = useComboboxProviderContext();
  props = {
    ...props,
    parent: props.parent !== void 0 ? props.parent : parent,
    menubar: props.menubar !== void 0 ? props.menubar : menubar,
    combobox: props.combobox !== void 0 ? props.combobox : combobox
  };
  const [store, update] = useStore(Core.createMenuStore, props);
  return useMenuStoreProps(store, update, props);
}

export {
  useMenuStoreProps,
  useMenuStore
};
