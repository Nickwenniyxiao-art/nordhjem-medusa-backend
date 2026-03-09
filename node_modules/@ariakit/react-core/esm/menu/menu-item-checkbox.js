"use client";
import {
  useMenuItem
} from "../__chunks/MOWGOTGG.js";
import {
  useMenuScopedContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/X6LNAU2F.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import {
  useCheckboxStore
} from "../__chunks/ALZMXNL4.js";
import {
  useCheckbox
} from "../__chunks/I7KWAPMF.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/EYKMH5G5.js";
import "../__chunks/ZVXT4QFT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useInitialValue
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-item-checkbox.tsx
import { invariant, shallowEqual } from "@ariakit/core/utils/misc";
import { useEffect } from "react";
var TagName = "div";
function getPrimitiveValue(value) {
  if (Array.isArray(value)) {
    return value.toString();
  }
  return value;
}
function getValue(storeValue, value, checked) {
  if (value === void 0) {
    if (Array.isArray(storeValue)) return storeValue;
    return !!checked;
  }
  const primitiveValue = getPrimitiveValue(value);
  if (!Array.isArray(storeValue)) {
    if (checked) {
      return primitiveValue;
    }
    return storeValue === primitiveValue ? false : storeValue;
  }
  if (checked) {
    if (storeValue.includes(primitiveValue)) {
      return storeValue;
    }
    return [...storeValue, primitiveValue];
  }
  return storeValue.filter((v) => v !== primitiveValue);
}
var useMenuItemCheckbox = createHook(
  function useMenuItemCheckbox2({
    store,
    name,
    value,
    checked,
    defaultChecked: defaultCheckedProp,
    hideOnClick = false,
    ...props
  }) {
    const context = useMenuScopedContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "MenuItemCheckbox must be wrapped in a MenuList or Menu component"
    );
    const defaultChecked = useInitialValue(defaultCheckedProp);
    useEffect(() => {
      store == null ? void 0 : store.setValue(name, (prevValue = []) => {
        if (!defaultChecked) return prevValue;
        return getValue(prevValue, value, true);
      });
    }, [store, name, value, defaultChecked]);
    useEffect(() => {
      if (checked === void 0) return;
      store == null ? void 0 : store.setValue(name, (prevValue) => {
        return getValue(prevValue, value, checked);
      });
    }, [store, name, value, checked]);
    const checkboxStore = useCheckboxStore({
      value: store.useState((state) => state.values[name]),
      setValue(internalValue) {
        store == null ? void 0 : store.setValue(name, () => {
          if (checked === void 0) return internalValue;
          const nextValue = getValue(internalValue, value, checked);
          if (!Array.isArray(nextValue)) return nextValue;
          if (!Array.isArray(internalValue)) return nextValue;
          if (shallowEqual(internalValue, nextValue)) return internalValue;
          return nextValue;
        });
      }
    });
    props = {
      role: "menuitemcheckbox",
      ...props
    };
    props = useCheckbox({
      store: checkboxStore,
      name,
      value,
      checked,
      ...props
    });
    props = useMenuItem({ store, hideOnClick, ...props });
    return props;
  }
);
var MenuItemCheckbox = memo(
  forwardRef(function MenuItemCheckbox2(props) {
    const htmlProps = useMenuItemCheckbox(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  MenuItemCheckbox,
  useMenuItemCheckbox
};
