"use client";
import {
  useMenuItem
} from "../__chunks/MOWGOTGG.js";
import {
  MenuItemCheckedContext,
  useMenuScopedContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/PTRWAQFT.js";
import {
  useRadio
} from "../__chunks/5TKKKQCL.js";
import "../__chunks/QOZ6WMRY.js";
import "../__chunks/X6LNAU2F.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useInitialValue,
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-item-radio.tsx
import { invariant } from "@ariakit/core/utils/misc";
import { useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
function getValue(prevValue, value, checked) {
  if (checked === void 0) return prevValue;
  if (checked) return value;
  return prevValue;
}
var useMenuItemRadio = createHook(
  function useMenuItemRadio2({
    store,
    name,
    value,
    checked,
    onChange: onChangeProp,
    hideOnClick = false,
    ...props
  }) {
    const context = useMenuScopedContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "MenuItemRadio must be wrapped in a MenuList or Menu component"
    );
    const defaultChecked = useInitialValue(props.defaultChecked);
    useEffect(() => {
      store == null ? void 0 : store.setValue(name, (prevValue = false) => {
        return getValue(prevValue, value, defaultChecked);
      });
    }, [store, name, value, defaultChecked]);
    useEffect(() => {
      if (checked === void 0) return;
      store == null ? void 0 : store.setValue(name, (prevValue) => {
        return getValue(prevValue, value, checked);
      });
    }, [store, name, value, checked]);
    const isChecked = store.useState((state) => state.values[name] === value);
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(MenuItemCheckedContext.Provider, { value: !!isChecked, children: element }),
      [isChecked]
    );
    props = {
      role: "menuitemradio",
      ...props
    };
    props = useRadio({
      name,
      value,
      checked: isChecked,
      onChange(event) {
        onChangeProp == null ? void 0 : onChangeProp(event);
        if (event.defaultPrevented) return;
        const element = event.currentTarget;
        store == null ? void 0 : store.setValue(name, (prevValue) => {
          return getValue(prevValue, value, checked != null ? checked : element.checked);
        });
      },
      ...props
    });
    props = useMenuItem({ store, hideOnClick, ...props });
    return props;
  }
);
var MenuItemRadio = memo(
  forwardRef(function MenuItemRadio2(props) {
    const htmlProps = useMenuItemRadio(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  MenuItemRadio,
  useMenuItemRadio
};
