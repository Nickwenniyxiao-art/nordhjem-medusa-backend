"use client";
import {
  SelectItem
} from "../__chunks/4M2S6L5P.js";
import {
  useSelectScopedContext
} from "../__chunks/AEGCXJZV.js";
import {
  useCompositeItemOffscreen
} from "../__chunks/PTR7CZ6Q.js";
import "../__chunks/X6LNAU2F.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/FMNW3QQI.js";
import {
  Role
} from "../__chunks/JG4VNI52.js";
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
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-item-offscreen.tsx
import { jsx } from "react/jsx-runtime";
var TagName = "div";
function useSelectItemOffscreen({ store, value, ...props }) {
  const context = useSelectScopedContext();
  store = store || context;
  return useCompositeItemOffscreen({ store, value, ...props });
}
var SelectItem2 = forwardRef(function SelectItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useSelectItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: useMergeRefs(ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ jsx(SelectItem, { ...allProps });
  }
  const {
    store,
    value,
    getItem,
    hideOnClick,
    setValueOnClick,
    preventScrollOnKeyDown,
    focusOnHover,
    blurOnHoverEnd,
    ...htmlProps
  } = allProps;
  const Component = Role[TagName];
  return /* @__PURE__ */ jsx(Component, { ...htmlProps });
});
export {
  SelectItem2 as SelectItem,
  useSelectItemOffscreen
};
