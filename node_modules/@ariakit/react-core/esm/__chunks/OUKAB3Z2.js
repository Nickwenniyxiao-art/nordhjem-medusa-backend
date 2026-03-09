"use client";
import {
  MenubarScopedContextProvider,
  useMenubarProviderContext
} from "./2DUOQURA.js";
import {
  useMenubarStore
} from "./6H6PBGDB.js";
import {
  useComposite
} from "./ZMWF7ASR.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useWrapElement
} from "./KPHZR4MB.js";

// src/menubar/menubar.tsx
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useMenubar = createHook(
  function useMenubar2({
    store: storeProp,
    composite = true,
    orientation: orientationProp,
    virtualFocus,
    focusLoop,
    rtl,
    ...props
  }) {
    const context = useMenubarProviderContext();
    storeProp = storeProp || context;
    const store = useMenubarStore({
      store: storeProp,
      orientation: orientationProp,
      virtualFocus,
      focusLoop,
      rtl
    });
    const orientation = store.useState(
      (state) => !composite || state.orientation === "both" ? void 0 : state.orientation
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(MenubarScopedContextProvider, { value: store, children: element }),
      [store]
    );
    if (composite) {
      props = {
        role: "menubar",
        "aria-orientation": orientation,
        ...props
      };
    }
    props = useComposite({ store, composite, ...props });
    return props;
  }
);
var Menubar = forwardRef(function Menubar2(props) {
  const htmlProps = useMenubar(props);
  return createElement(TagName, htmlProps);
});

export {
  useMenubar,
  Menubar
};
