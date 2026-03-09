"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');


var _M6ZB7Q5Fcjs = require('../__chunks/M6ZB7Q5F.cjs');
require('../__chunks/6N7G7IZO.cjs');


var _7WQJLR5Ucjs = require('../__chunks/7WQJLR5U.cjs');


var _V4CSM2URcjs = require('../__chunks/V4CSM2UR.cjs');
require('../__chunks/YQMDNMVH.cjs');
require('../__chunks/HY6WXQ7B.cjs');
require('../__chunks/NRJF3KTK.cjs');
require('../__chunks/MIBORXQW.cjs');


var _L22B4P6Ycjs = require('../__chunks/L22B4P6Y.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');





var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-button.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
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
var useMenuButton = _743QABRAcjs.createHook.call(void 0, 
  function useMenuButton2({
    store,
    focusable,
    accessibleWhenDisabled,
    showOnHover,
    ...props
  }) {
    const context = _JJQSOPYIcjs.useMenuProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "MenuButton must receive a `store` prop or be wrapped in a MenuProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const parentMenu = store.parent;
    const parentMenubar = store.menubar;
    const hasParentMenu = !!parentMenu;
    const parentIsMenubar = !!parentMenubar && !hasParentMenu;
    const disabled = _misc.disabledFromProps.call(void 0, props);
    const showMenu = () => {
      const trigger = ref.current;
      if (!trigger) return;
      store == null ? void 0 : store.setDisclosureElement(trigger);
      store == null ? void 0 : store.setAnchorElement(trigger);
      store == null ? void 0 : store.show();
    };
    const onFocusProp = props.onFocus;
    const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
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
    const dir = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store,
      (state) => state.placement.split("-")[0]
    );
    const onKeyDownProp = props.onKeyDown;
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
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
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
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
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _JJQSOPYIcjs.MenuContextProvider, { value: store, children: element }),
      [store]
    );
    if (hasParentMenu) {
      props = {
        ...props,
        render: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L22B4P6Ycjs.Role.div, { render: props.render })
      };
    }
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const parentContentElement = _YY2UXBEBcjs.useStoreState.call(void 0, 
      (parentMenu == null ? void 0 : parentMenu.combobox) || parentMenu,
      "contentElement"
    );
    const role = hasParentMenu || parentIsMenubar ? _dom.getPopupItemRole.call(void 0, parentContentElement, "menuitem") : void 0;
    const contentElement = store.useState("contentElement");
    props = {
      id,
      role,
      "aria-haspopup": _dom.getPopupRole.call(void 0, contentElement, "menu"),
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onFocus,
      onKeyDown,
      onClick
    };
    props = _M6ZB7Q5Fcjs.useHovercardAnchor.call(void 0, {
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
    props = _V4CSM2URcjs.usePopoverDisclosure.call(void 0, {
      store,
      toggleOnClick: !hasParentMenu,
      focusable,
      accessibleWhenDisabled,
      ...props
    });
    props = _7WQJLR5Ucjs.useCompositeTypeahead.call(void 0, {
      store,
      typeahead: parentIsMenubar,
      ...props
    });
    return props;
  }
);
var MenuButton = _743QABRAcjs.forwardRef.call(void 0, function MenuButton2(props) {
  const htmlProps = useMenuButton(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuButton = MenuButton; exports.useMenuButton = useMenuButton;
