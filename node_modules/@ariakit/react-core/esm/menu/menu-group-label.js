"use client";
import {
  useCompositeGroupLabel
} from "../__chunks/JUZDESDO.js";
import "../__chunks/NH3GYEZ7.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-group-label.tsx
var TagName = "div";
var useMenuGroupLabel = createHook(
  function useMenuGroupLabel2(props) {
    props = useCompositeGroupLabel(props);
    return props;
  }
);
var MenuGroupLabel = forwardRef(function MenuGroupLabel2(props) {
  const htmlProps = useMenuGroupLabel(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuGroupLabel,
  useMenuGroupLabel
};
