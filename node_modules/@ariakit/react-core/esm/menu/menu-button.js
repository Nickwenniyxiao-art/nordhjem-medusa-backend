"use client";
import {
  MenuContextProvider,
  useMenuProviderContext
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import {
  useHovercardAnchor
} from "../__chunks/2XVFVSLB.js";
import "../__chunks/PTRWAQFT.js";
import {
  useCompositeTypeahead
} from "../__chunks/FORDJ4GP.js";
import {
  usePopoverDisclosure
} from "../__chunks/RFRKSHIZ.js";
import "../__chunks/4POTBZ2J.js";
import "../__chunks/APVORPDK.js";
import "../__chunks/NDVACHQI.js";
import "../__chunks/5VQZOHHZ.js";
import {
  Role
} from "../__chunks/JG4VNI52.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/HMKTUWOU.js";
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
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent,
  useId,
  useMergeRefs,
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-button.tsx
import { getPopupItemRole, getPopupRole } from "@ariakit/core/utils/dom";
import { disabledFromProps, invariant } from "@ariakit/core/utils/misc";
import { useRef } from "react";
import { jsx } from "react/jsx-runtime";
var TagName = "button";
function getInitialFocus(event, dir) {
  const keyMap = {
    ArrowDown: dir === "bottom" || dir === "top" ? "first" : false,
    ArrowUp: dir === "bottom" || dir === "top" ? "last" : false,
    ArrowRight: dir === "right" ? "first" : false,
    ArrowLeft: dir === "left" ? "first" : false
  };
  return keyMap[event.key];
}
function hasActiveItem(items, excludeElement) {
  return !!(items == null ? void 0 : items.some((item) => {
    if (!item.element) return false;
    if (item.element === excludeElement) return false;
    return item.element.getAttribute("aria-expanded") === "true";
  }));
}
var useMenuButton = createHook(
  function useMenuButton2({
    store,
    focusable,
    accessibleWhenDisabled,
    showOnHover,
    ...props
  }) {
    const context = useMenuProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "MenuButton must receive a `store` prop or be wrapped in a MenuProvider component."
    );
    const ref = useRef(null);
    const parentMenu = store.parent;
    const parentMenubar = store.menubar;
    const hasParentMenu = !!parentMenu;
    const parentIsMenubar = !!parentMenubar && !hasParentMenu;
    const disabled = disabledFromProps(props);
    const showMenu = () => {
      const trigger = ref.current;
      if (!trigger) return;
      store == null ? void 0 : store.setDisclosureElement(trigger);
      store == null ? void 0 : store.setAnchorElement(trigger);
      store == null ? void 0 : store.show();
    };
    const onFocusProp = props.onFocus;
    const onFocus = useEvent((event) => {
      onFocusProp == null ? void 0 : onFocusProp(event);
      if (disabled) return;
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setAutoFocusOnShow(false);
      store == null ? void 0 : store.setActiveId(null);
      if (!parentMenubar) return;
      if (!parentIsMenubar) return;
      const { items } = parentMenubar.getState();
      if (hasActiveItem(items, event.currentTarget)) {
        showMenu();
      }
    });
    const dir = useStoreState(
      store,
      (state) => state.placement.split("-")[0]
    );
    const onKeyDownProp = props.onKeyDown;
    const onKeyDown = useEvent((event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (disabled) return;
      if (event.defaultPrevented) return;
      const initialFocus = getInitialFocus(event, dir);
      if (initialFocus) {
        event.preventDefault();
        showMenu();
        store == null ? void 0 : store.setAutoFocusOnShow(true);
        store == null ? void 0 : store.setInitialFocus(initialFocus);
      }
    });
    const onClickProp = props.onClick;
    const onClick = useEvent((event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (!store) return;
      const isKeyboardClick = !event.detail;
      const { open } = store.getState();
      if (!open || isKeyboardClick) {
        if (!hasParentMenu || isKeyboardClick) {
          store.setAutoFocusOnShow(true);
        }
        store.setInitialFocus(isKeyboardClick ? "first" : "container");
      }
      if (hasParentMenu) {
        showMenu();
      }
    });
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(MenuContextProvider, { value: store, children: element }),
      [store]
    );
    if (hasParentMenu) {
      props = {
        ...props,
        render: /* @__PURE__ */ jsx(Role.div, { render: props.render })
      };
    }
    const id = useId(props.id);
    const parentContentElement = useStoreState(
      (parentMenu == null ? void 0 : parentMenu.combobox) || parentMenu,
      "contentElement"
    );
    const role = hasParentMenu || parentIsMenubar ? getPopupItemRole(parentContentElement, "menuitem") : void 0;
    const contentElement = store.useState("contentElement");
    props = {
      id,
      role,
      "aria-haspopup": getPopupRole(contentElement, "menu"),
      ...props,
      ref: useMergeRefs(ref, props.ref),
      onFocus,
      onKeyDown,
      onClick
    };
    props = useHovercardAnchor({
      store,
      focusable,
      accessibleWhenDisabled,
      ...props,
      showOnHover: (event) => {
        const getShowOnHover = () => {
          if (typeof showOnHover === "function") return showOnHover(event);
          if (showOnHover != null) return showOnHover;
          if (hasParentMenu) return true;
          if (!parentMenubar) return false;
          const { items } = parentMenubar.getState();
          return parentIsMenubar && hasActiveItem(items);
        };
        const canShowOnHover = getShowOnHover();
        if (!canShowOnHover) return false;
        const parent = parentIsMenubar ? parentMenubar : parentMenu;
        if (!parent) return true;
        parent.setActiveId(event.currentTarget.id);
        return true;
      }
    });
    props = usePopoverDisclosure({
      store,
      toggleOnClick: !hasParentMenu,
      focusable,
      accessibleWhenDisabled,
      ...props
    });
    props = useCompositeTypeahead({
      store,
      typeahead: parentIsMenubar,
      ...props
    });
    return props;
  }
);
var MenuButton = forwardRef(function MenuButton2(props) {
  const htmlProps = useMenuButton(props);
  return createElement(TagName, htmlProps);
});
export {
  MenuButton,
  useMenuButton
};
