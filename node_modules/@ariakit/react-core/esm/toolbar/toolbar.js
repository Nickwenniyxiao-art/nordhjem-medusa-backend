"use client";
import {
  useToolbarStore
} from "../__chunks/5WUV565P.js";
import {
  ToolbarScopedContextProvider,
  useToolbarProviderContext
} from "../__chunks/WZDDDI4V.js";
import "../__chunks/IQYAUKXT.js";
import {
  useComposite
} from "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
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

// src/toolbar/toolbar.tsx
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useToolbar = createHook(
  function useToolbar2({
    store: storeProp,
    orientation: orientationProp,
    virtualFocus,
    focusLoop,
    rtl,
    ...props
  }) {
    const context = useToolbarProviderContext();
    storeProp = storeProp || context;
    const store = useToolbarStore({
      store: storeProp,
      orientation: orientationProp,
      virtualFocus,
      focusLoop,
      rtl
    });
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(ToolbarScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      role: "toolbar",
      "aria-orientation": orientation,
      ...props
    };
    props = useComposite({ store, ...props });
    return props;
  }
);
var Toolbar = forwardRef(function Toolbar2(props) {
  const htmlProps = useToolbar(props);
  return createElement(TagName, htmlProps);
});
export {
  Toolbar,
  useToolbar
};
