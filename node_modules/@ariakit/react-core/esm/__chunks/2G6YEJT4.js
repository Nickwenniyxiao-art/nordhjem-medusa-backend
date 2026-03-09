"use client";
import {
  isHidden
} from "./6B3RXHKP.js";
import {
  ComboboxListRoleContext,
  ComboboxScopedContextProvider,
  useComboboxContext,
  useComboboxScopedContext
} from "./CVCFNOHX.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useAttribute,
  useId,
  useMergeRefs,
  useSafeLayoutEffect,
  useWrapElement
} from "./KPHZR4MB.js";

// src/combobox/combobox-list.tsx
import { invariant, removeUndefinedValues } from "@ariakit/core/utils/misc";
import { useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useComboboxList = createHook(
  function useComboboxList2({ store, alwaysVisible, ...props }) {
    const scopedContext = useComboboxScopedContext(true);
    const context = useComboboxContext();
    store = store || context;
    const scopedContextSameStore = !!store && store === scopedContext;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "ComboboxList must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const ref = useRef(null);
    const id = useId(props.id);
    const mounted = store.useState("mounted");
    const hidden = isHidden(mounted, props.hidden, alwaysVisible);
    const style = hidden ? { ...props.style, display: "none" } : props.style;
    const multiSelectable = store.useState(
      (state) => Array.isArray(state.selectedValue)
    );
    const role = useAttribute(ref, "role", props.role);
    const isCompositeRole = role === "listbox" || role === "tree" || role === "grid";
    const ariaMultiSelectable = isCompositeRole ? multiSelectable || void 0 : void 0;
    const [hasListboxInside, setHasListboxInside] = useState(false);
    const contentElement = store.useState("contentElement");
    useSafeLayoutEffect(() => {
      if (!mounted) return;
      const element = ref.current;
      if (!element) return;
      if (contentElement !== element) return;
      const callback = () => {
        setHasListboxInside(!!element.querySelector("[role='listbox']"));
      };
      const observer = new MutationObserver(callback);
      observer.observe(element, {
        subtree: true,
        childList: true,
        attributeFilter: ["role"]
      });
      callback();
      return () => observer.disconnect();
    }, [mounted, contentElement]);
    if (!hasListboxInside) {
      props = {
        role: "listbox",
        "aria-multiselectable": ariaMultiSelectable,
        ...props
      };
    }
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(ComboboxScopedContextProvider, { value: store, children: /* @__PURE__ */ jsx(ComboboxListRoleContext.Provider, { value: role, children: element }) }),
      [store, role]
    );
    const setContentElement = id && (!scopedContext || !scopedContextSameStore) ? store.setContentElement : null;
    props = {
      id,
      hidden,
      ...props,
      ref: useMergeRefs(setContentElement, ref, props.ref),
      style
    };
    return removeUndefinedValues(props);
  }
);
var ComboboxList = forwardRef(function ComboboxList2(props) {
  const htmlProps = useComboboxList(props);
  return createElement(TagName, htmlProps);
});

export {
  useComboboxList,
  ComboboxList
};
