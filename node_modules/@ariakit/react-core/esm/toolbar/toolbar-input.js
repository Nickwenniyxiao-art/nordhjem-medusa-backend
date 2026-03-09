"use client";
import {
  useToolbarItem
} from "../__chunks/HSU7H6PW.js";
import {
  useToolbarContext
} from "../__chunks/WZDDDI4V.js";
import "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
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
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/toolbar/toolbar-input.tsx
var TagName = "input";
var useToolbarInput = createHook(
  function useToolbarInput2({ store, ...props }) {
    const context = useToolbarContext();
    store = store || context;
    props = useToolbarItem({ store, ...props });
    return props;
  }
);
var ToolbarInput = memo(
  forwardRef(function ToolbarInput2(props) {
    const htmlProps = useToolbarInput(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  ToolbarInput,
  useToolbarInput
};
