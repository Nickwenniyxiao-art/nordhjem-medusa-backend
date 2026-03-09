"use client";
import {
  useToolbarContext
} from "./WZDDDI4V.js";
import {
  useCompositeItem
} from "./WZWDIE3S.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "./GWSL6KNJ.js";

// src/toolbar/toolbar-item.tsx
var TagName = "button";
var useToolbarItem = createHook(
  function useToolbarItem2({ store, ...props }) {
    const context = useToolbarContext();
    store = store || context;
    props = useCompositeItem({ store, ...props });
    return props;
  }
);
var ToolbarItem = memo(
  forwardRef(function ToolbarItem2(props) {
    const htmlProps = useToolbarItem(props);
    return createElement(TagName, htmlProps);
  })
);

export {
  useToolbarItem,
  ToolbarItem
};
