"use client";
import {
  useTabScopedContext
} from "../__chunks/NF43FNG5.js";
import {
  CompositeItem,
  useCompositeItem
} from "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import {
  useStoreState
} from "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef,
  memo
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent,
  useId
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tab/tab.tsx
import { disabledFromProps, invariant } from "@ariakit/core/utils/misc";
import { useCallback } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "button";
var useTab = createHook(function useTab2({
  store,
  getItem: getItemProp,
  ...props
}) {
  var _a;
  const context = useTabScopedContext();
  store = store || context;
  invariant(
    store,
    process.env.NODE_ENV !== "production" && "Tab must be wrapped in a TabList component."
  );
  const defaultId = useId();
  const id = props.id || defaultId;
  const dimmed = disabledFromProps(props);
  const getItem = useCallback(
    (item) => {
      const nextItem = { ...item, dimmed };
      if (getItemProp) {
        return getItemProp(nextItem);
      }
      return nextItem;
    },
    [dimmed, getItemProp]
  );
  const onClickProp = props.onClick;
  const onClick = useEvent((event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    store == null ? void 0 : store.setSelectedId(id);
  });
  const panelId = store.panels.useState(
    (state) => {
      var _a2;
      return (_a2 = state.items.find((item) => item.tabId === id)) == null ? void 0 : _a2.id;
    }
  );
  const shouldRegisterItem = defaultId ? props.shouldRegisterItem : false;
  const isActive = store.useState((state) => !!id && state.activeId === id);
  const selected = store.useState((state) => !!id && state.selectedId === id);
  const hasActiveItem = store.useState((state) => !!store.item(state.activeId));
  const canRegisterComposedItem = isActive || selected && !hasActiveItem;
  const accessibleWhenDisabled = selected || ((_a = props.accessibleWhenDisabled) != null ? _a : true);
  const isWithinVirtualFocusComposite = useStoreState(
    store.combobox || store.composite,
    "virtualFocus"
  );
  if (isWithinVirtualFocusComposite) {
    props = {
      ...props,
      tabIndex: -1
    };
  }
  props = {
    id,
    role: "tab",
    "aria-selected": selected,
    "aria-controls": panelId || void 0,
    ...props,
    onClick
  };
  if (store.composite) {
    const defaultProps = {
      id,
      accessibleWhenDisabled,
      store: store.composite,
      shouldRegisterItem: canRegisterComposedItem && shouldRegisterItem,
      rowId: props.rowId,
      render: props.render
    };
    props = {
      ...props,
      render: /* @__PURE__ */ jsx(
        CompositeItem,
        {
          ...defaultProps,
          render: store.combobox && store.composite !== store.combobox ? /* @__PURE__ */ jsx(CompositeItem, { ...defaultProps, store: store.combobox }) : defaultProps.render
        }
      )
    };
  }
  props = useCompositeItem({
    store,
    ...props,
    accessibleWhenDisabled,
    getItem,
    shouldRegisterItem
  });
  return props;
});
var Tab = memo(
  forwardRef(function Tab2(props) {
    const htmlProps = useTab(props);
    return createElement(TagName, htmlProps);
  })
);
export {
  Tab,
  useTab
};
