"use client";
import {
  CompositeItem
} from "./WZWDIE3S.js";
import {
  useCollectionItemOffscreen
} from "./FMNW3QQI.js";
import {
  Role
} from "./JG4VNI52.js";
import {
  useCompositeContext
} from "./AVVXDJMZ.js";
import {
  useStoreStateObject
} from "./Q5W46E73.js";
import {
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useId,
  useMergeRefs
} from "./KPHZR4MB.js";

// src/composite/composite-item-offscreen.tsx
import { getPopupItemRole } from "@ariakit/core/utils/dom";
import { jsx } from "react/jsx-runtime";
var TagName = "button";
function useCompositeItemOffscreen({ store, offscreenBehavior = "active", disabled, value, ...props }) {
  const context = useCompositeContext();
  store = store || context;
  const id = useId(props.id);
  const { storeId, active, listElement, offscreenRoot } = useStoreStateObject(
    store,
    {
      storeId: "id",
      active(state) {
        if (!state) return;
        if (!("selectedValue" in state) && "value" in state) {
          if (state.value === value) return true;
        }
        return !!id && state.activeId === id;
      },
      listElement(state) {
        if (!state) return;
        if (!("listElement" in state)) return;
        return state.listElement;
      },
      offscreenRoot(state) {
        if (props.offscreenRoot) return props.offscreenRoot;
        if (!state) return;
        if (!("contentElement" in state)) return;
        return state.contentElement || null;
      }
    }
  );
  const offscreenProps = useCollectionItemOffscreen({
    id,
    store,
    offscreenBehavior: active ? "active" : offscreenBehavior,
    ...props,
    offscreenRoot
  });
  if (!offscreenProps.active) {
    return {
      ...offscreenProps,
      children: value,
      role: getPopupItemRole(listElement),
      "aria-disabled": disabled || void 0,
      "data-offscreen-id": storeId
    };
  }
  return offscreenProps;
}
var CompositeItem2 = forwardRef(function CompositeItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useCompositeItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: useMergeRefs(ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ jsx(CompositeItem, { ...allProps });
  }
  const {
    store,
    rowId,
    preventScrollOnKeyDown,
    moveOnKeyPress,
    tabbable,
    getItem,
    ...htmlProps
  } = allProps;
  const Component = Role[TagName];
  return /* @__PURE__ */ jsx(Component, { ...htmlProps });
});

export {
  useCompositeItemOffscreen,
  CompositeItem2 as CompositeItem
};
