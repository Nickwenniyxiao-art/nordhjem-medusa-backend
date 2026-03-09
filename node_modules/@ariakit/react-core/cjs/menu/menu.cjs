"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _SQ6Y6NO5cjs = require('../__chunks/SQ6Y6NO5.cjs');


var _OYEJQSLLcjs = require('../__chunks/OYEJQSLL.cjs');
require('../__chunks/L6CLLK7R.cjs');


var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/7WQJLR5U.cjs');
require('../__chunks/J7ATZCFK.cjs');


var _ANHHZKY4cjs = require('../__chunks/ANHHZKY4.cjs');
require('../__chunks/KHJERDK3.cjs');
require('../__chunks/UI5KWBYV.cjs');
require('../__chunks/L634CRNJ.cjs');
require('../__chunks/VGI2PE2B.cjs');
require('../__chunks/ZPT6IQKO.cjs');
require('../__chunks/FBPPLGNN.cjs');
require('../__chunks/W32FX7DM.cjs');
require('../__chunks/OLXEI7QX.cjs');
require('../__chunks/6GRO3ZM4.cjs');
require('../__chunks/TXUJ5BOC.cjs');
require('../__chunks/H2FXMMBN.cjs');
require('../__chunks/5AGCRCKV.cjs');
require('../__chunks/JLMLKTUB.cjs');
require('../__chunks/LCWSLOYU.cjs');
require('../__chunks/V7JASX7S.cjs');
require('../__chunks/56NPFF7P.cjs');
require('../__chunks/GASMO7Y4.cjs');
require('../__chunks/GX66UERW.cjs');
require('../__chunks/26P4PLHI.cjs');
require('../__chunks/YVOQ2BCB.cjs');
require('../__chunks/4SKDRUBR.cjs');
require('../__chunks/AQ2LO7WV.cjs');
require('../__chunks/3ZDSDKC6.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');
require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/L22B4P6Y.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu.tsx
var _events = require('@ariakit/core/utils/events');
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
var useMenu = _743QABRAcjs.createHook.call(void 0, function useMenu2({
  store,
  modal: modalProp = false,
  portal = !!modalProp,
  hideOnEscape = true,
  autoFocusOnShow = true,
  hideOnHoverOutside,
  alwaysVisible,
  ...props
}) {
  const context = _JJQSOPYIcjs.useMenuProviderContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "Menu must receive a `store` prop or be wrapped in a MenuProvider component."
  );
  const ref = _react.useRef.call(void 0, null);
  const parentMenu = store.parent;
  const parentMenubar = store.menubar;
  const hasParentMenu = !!parentMenu;
  const parentIsMenubar = !!parentMenubar && !hasParentMenu;
  props = {
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
  };
  const { "aria-labelledby": ariaLabelledBy, ...menuListProps } = _SQ6Y6NO5cjs.useMenuList.call(void 0, {
    store,
    alwaysVisible,
    ...props
  });
  props = menuListProps;
  const [initialFocusRef, setInitialFocusRef] = _react.useState.call(void 0, );
  const autoFocusOnShowState = store.useState("autoFocusOnShow");
  const initialFocus = store.useState("initialFocus");
  const baseElement = store.useState("baseElement");
  const items = store.useState("renderedItems");
  _react.useEffect.call(void 0, () => {
    let cleaning = false;
    setInitialFocusRef((prevInitialFocusRef) => {
      var _a, _b, _c;
      if (cleaning) return;
      if (!autoFocusOnShowState) return;
      if ((_a = prevInitialFocusRef == null ? void 0 : prevInitialFocusRef.current) == null ? void 0 : _a.isConnected) return prevInitialFocusRef;
      const ref2 = _react.createRef.call(void 0, );
      switch (initialFocus) {
        // TODO: Refactor
        case "first":
          ref2.current = ((_b = items.find((item) => !item.disabled && item.element)) == null ? void 0 : _b.element) || null;
          break;
        case "last":
          ref2.current = ((_c = [...items].reverse().find((item) => !item.disabled && item.element)) == null ? void 0 : _c.element) || null;
          break;
        default:
          ref2.current = baseElement;
      }
      return ref2;
    });
    return () => {
      cleaning = true;
    };
  }, [store, autoFocusOnShowState, initialFocus, items, baseElement]);
  const modal = hasParentMenu ? false : modalProp;
  const mayAutoFocusOnShow = !!autoFocusOnShow;
  const canAutoFocusOnShow = !!initialFocusRef || !!props.initialFocus || !!modal;
  const contentElement = _YY2UXBEBcjs.useStoreState.call(void 0, 
    store.combobox || store,
    "contentElement"
  );
  const parentContentElement = _YY2UXBEBcjs.useStoreState.call(void 0, 
    (parentMenu == null ? void 0 : parentMenu.combobox) || parentMenu,
    "contentElement"
  );
  const preserveTabOrderAnchor = _react.useMemo.call(void 0, () => {
    if (!parentContentElement) return;
    if (!contentElement) return;
    const role = contentElement.getAttribute("role");
    const parentRole = parentContentElement.getAttribute("role");
    const parentIsMenuOrMenubar = parentRole === "menu" || parentRole === "menubar";
    if (parentIsMenuOrMenubar && role === "menu") return;
    return parentContentElement;
  }, [contentElement, parentContentElement]);
  if (preserveTabOrderAnchor !== void 0) {
    props = {
      preserveTabOrderAnchor,
      ...props
    };
  }
  props = _OYEJQSLLcjs.useHovercard.call(void 0, {
    store,
    alwaysVisible,
    initialFocus: initialFocusRef,
    autoFocusOnShow: mayAutoFocusOnShow ? canAutoFocusOnShow && autoFocusOnShow : autoFocusOnShowState || !!modal,
    ...props,
    hideOnEscape(event) {
      if (_misc.isFalsyBooleanCallback.call(void 0, hideOnEscape, event)) return false;
      store == null ? void 0 : store.hideAll();
      return true;
    },
    hideOnHoverOutside(event) {
      const disclosureElement = store == null ? void 0 : store.getState().disclosureElement;
      const getHideOnHoverOutside = () => {
        if (typeof hideOnHoverOutside === "function") {
          return hideOnHoverOutside(event);
        }
        if (hideOnHoverOutside != null) return hideOnHoverOutside;
        if (hasParentMenu) return true;
        if (!parentIsMenubar) return false;
        if (!disclosureElement) return true;
        if (_focus.hasFocusWithin.call(void 0, disclosureElement)) return false;
        return true;
      };
      if (!getHideOnHoverOutside()) return false;
      if (event.defaultPrevented) return true;
      if (!hasParentMenu) return true;
      if (!disclosureElement) return true;
      _events.fireEvent.call(void 0, disclosureElement, "mouseout", event);
      if (!_focus.hasFocusWithin.call(void 0, disclosureElement)) return true;
      requestAnimationFrame(() => {
        if (_focus.hasFocusWithin.call(void 0, disclosureElement)) return;
        store == null ? void 0 : store.hide();
      });
      return false;
    },
    modal,
    portal,
    backdrop: hasParentMenu ? false : props.backdrop
  });
  props = {
    "aria-labelledby": ariaLabelledBy,
    ...props
  };
  return props;
});
var Menu = _ANHHZKY4cjs.createDialogComponent.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Menu2(props) {
    const htmlProps = useMenu(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _JJQSOPYIcjs.useMenuProviderContext
);



exports.Menu = Menu; exports.useMenu = useMenu;
