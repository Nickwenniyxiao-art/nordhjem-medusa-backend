"use client";
import {
  TabScopedContextProvider,
  useTabProviderContext
} from "../__chunks/NF43FNG5.js";
import {
  useComposite
} from "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tab/tab-list.tsx
import { invariant } from "@ariakit/core/utils/misc";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useTabList = createHook(
  function useTabList2({ store, ...props }) {
    const context = useTabProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "TabList must receive a `store` prop or be wrapped in a TabProvider component."
    );
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(TabScopedContextProvider, { value: store, children: element }),
      [store]
    );
    if (store.composite) {
      props = {
        focusable: false,
        ...props
      };
    }
    props = {
      role: "tablist",
      "aria-orientation": orientation,
      ...props
    };
    props = useComposite({ store, ...props });
    return props;
  }
);
var TabList = forwardRef(function TabList2(props) {
  const htmlProps = useTabList(props);
  return createElement(TagName, htmlProps);
});
export {
  TabList,
  useTabList
};
