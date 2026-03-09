"use client";
import {
  useCompositeGroup
} from "../__chunks/XXOHUFXO.js";
import "../__chunks/Y6I7WX7H.js";
import "../__chunks/7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-group.tsx
var TagName = "div";
var useMenuGroup = createHook(
  function useMenuGroup2(props) {
    props = useCompositeGroup(props);
    return props;
  }
);
var MenuGroup = forwardRef(function MenuGroup2(props) {
  const htmlProps = useMenuGroup(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuGroup,
  useMenuGroup
};
