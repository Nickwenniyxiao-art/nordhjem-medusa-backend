"use client";
import {
  useToolbarContext
} from "../__chunks/WZDDDI4V.js";
import {
  useCompositeSeparator
} from "../__chunks/YBRT277Q.js";
import "../__chunks/P7VC6T3R.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/toolbar/toolbar-separator.tsx
var TagName = "hr";
var useToolbarSeparator = createHook(
  function useToolbarSeparator2({ store, ...props }) {
    const context = useToolbarContext();
    store = store || context;
    props = useCompositeSeparator({ store, ...props });
    return props;
  }
);
var ToolbarSeparator = forwardRef(function ToolbarSeparator2(props) {
  const htmlProps = useToolbarSeparator(props);
  return createElement(TagName, htmlProps);
});
export {
  ToolbarSeparator,
  useToolbarSeparator
};
