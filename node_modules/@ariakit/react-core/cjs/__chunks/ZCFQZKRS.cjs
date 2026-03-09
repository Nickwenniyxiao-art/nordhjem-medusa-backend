"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _JJQSOPYIcjs = require('./JJQSOPYI.cjs');


var _WJN3C6NMcjs = require('./WJN3C6NM.cjs');


var _ALTUQCI3cjs = require('./ALTUQCI3.cjs');


var _WS3AS5PBcjs = require('./WS3AS5PB.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');





var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/menu/menu-item.tsx
var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var TagName = "div";
function menuHasFocus(baseElement, items, currentTarget) {
  var _a;
  if (!baseElement) return false;
  if (_focus.hasFocusWithin.call(void 0, baseElement)) return true;
  const expandedItem = items == null ? void 0 : items.find((item) => {
    var _a2;
    if (item.element === currentTarget) return false;
    return ((_a2 = item.element) == null ? void 0 : _a2.getAttribute("aria-expanded")) === "true";
  });
  const expandedMenuId = (_a = expandedItem == null ? void 0 : expandedItem.element) == null ? void 0 : _a.getAttribute("aria-controls");
  if (!expandedMenuId) return false;
  const doc = _dom.getDocument.call(void 0, baseElement);
  const expandedMenu = doc.getElementById(expandedMenuId);
  if (!expandedMenu) return false;
  if (_focus.hasFocusWithin.call(void 0, expandedMenu)) return true;
  return !!expandedMenu.querySelector("[role=menuitem][aria-expanded=true]");
}
var useMenuItem = _743QABRAcjs.createHook.call(void 0, 
  function useMenuItem2({
    store,
    hideOnClick = true,
    preventScrollOnKeyDown = true,
    focusOnHover,
    blurOnHoverEnd,
    ...props
  }) {
    const menuContext = _JJQSOPYIcjs.useMenuScopedContext.call(void 0, true);
    const menubarContext = _WJN3C6NMcjs.useMenubarScopedContext.call(void 0, );
    store = store || menuContext || menubarContext;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "MenuItem must be wrapped in a MenuList, Menu or Menubar component"
    );
    const onClickProp = props.onClick;
    const hideOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, hideOnClick);
    const hideMenu = "hideAll" in store ? store.hideAll : void 0;
    const isWithinMenu = !!hideMenu;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (_events.isDownloading.call(void 0, event)) return;
      if (_events.isOpeningInNewTab.call(void 0, event)) return;
      if (!hideMenu) return;
      const popupType = event.currentTarget.getAttribute("aria-haspopup");
      if (popupType === "menu") return;
      if (!hideOnClickProp(event)) return;
      hideMenu();
    });
    const contentElement = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store,
      (state) => "contentElement" in state ? state.contentElement : null
    );
    const role = _dom.getPopupItemRole.call(void 0, contentElement, "menuitem");
    props = {
      role,
      ...props,
      onClick
    };
    props = _WS3AS5PBcjs.useCompositeItem.call(void 0, {
      store,
      preventScrollOnKeyDown,
      ...props
    });
    props = _ALTUQCI3cjs.useCompositeHover.call(void 0, {
      store,
      ...props,
      focusOnHover(event) {
        const getFocusOnHover = () => {
          if (typeof focusOnHover === "function") return focusOnHover(event);
          if (focusOnHover != null) return focusOnHover;
          return true;
        };
        if (!store) return false;
        if (!getFocusOnHover()) return false;
        const { baseElement, items } = store.getState();
        if (isWithinMenu) {
          if (event.currentTarget.hasAttribute("aria-expanded")) {
            event.currentTarget.focus();
          }
          return true;
        }
        if (menuHasFocus(baseElement, items, event.currentTarget)) {
          event.currentTarget.focus();
          return true;
        }
        return false;
      },
      blurOnHoverEnd(event) {
        if (typeof blurOnHoverEnd === "function") return blurOnHoverEnd(event);
        if (blurOnHoverEnd != null) return blurOnHoverEnd;
        return isWithinMenu;
      }
    });
    return props;
  }
);
var MenuItem = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function MenuItem2(props) {
    const htmlProps = useMenuItem(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);




exports.useMenuItem = useMenuItem; exports.MenuItem = MenuItem;
