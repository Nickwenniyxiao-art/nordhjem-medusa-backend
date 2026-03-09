"use client";
import {
  useDisclosure
} from "./NDVACHQI.js";
import {
  useDialogProviderContext
} from "./A62MDFCW.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/dialog/dialog-disclosure.tsx
import { getPopupRole } from "@ariakit/core/utils/dom";
import { invariant } from "@ariakit/core/utils/misc";
var TagName = "button";
var useDialogDisclosure = createHook(
  function useDialogDisclosure2({ store, ...props }) {
    const context = useDialogProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "DialogDisclosure must receive a `store` prop or be wrapped in a DialogProvider component."
    );
    const contentElement = store.useState("contentElement");
    props = {
      "aria-haspopup": getPopupRole(contentElement, "dialog"),
      ...props
    };
    props = useDisclosure({ store, ...props });
    return props;
  }
);
var DialogDisclosure = forwardRef(function DialogDisclosure2(props) {
  const htmlProps = useDialogDisclosure(props);
  return createElement(TagName, htmlProps);
});

export {
  useDialogDisclosure,
  DialogDisclosure
};
