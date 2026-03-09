"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _JJQSOPYIcjs = require('./JJQSOPYI.cjs');


var _7WQJLR5Ucjs = require('./7WQJLR5U.cjs');


var _3ZDSDKC6cjs = require('./3ZDSDKC6.cjs');


var _YTQONGS5cjs = require('./YTQONGS5.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');





var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/menu/menu-list.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function useAriaLabelledBy({ store, ...props }) {
  const [id, setId] = _react.useState.call(void 0, void 0);
  const label = props["aria-label"];
  const disclosureElement = _YY2UXBEBcjs.useStoreState.call(void 0, store, "disclosureElement");
  const contentElement = _YY2UXBEBcjs.useStoreState.call(void 0, store, "contentElement");
  _react.useEffect.call(void 0, () => {
    const disclosure = disclosureElement;
    if (!disclosure) return;
    const menu = contentElement;
    if (!menu) return;
    const menuLabel = label || menu.hasAttribute("aria-label");
    if (menuLabel) {
      setId(void 0);
    } else if (disclosure.id) {
      setId(disclosure.id);
    }
  }, [label, disclosureElement, contentElement]);
  return id;
}
var useMenuList = _743QABRAcjs.createHook.call(void 0, 
  function useMenuList2({ store, alwaysVisible, composite, ...props }) {
    const context = _JJQSOPYIcjs.useMenuProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "MenuList must receive a `store` prop or be wrapped in a MenuProvider component."
    );
    const parentMenu = store.parent;
    const parentMenubar = store.menubar;
    const hasParentMenu = !!parentMenu;
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const onKeyDownProp = props.onKeyDown;
    const dir = store.useState(
      (state) => state.placement.split("-")[0]
    );
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    const isHorizontal = orientation !== "vertical";
    const isMenubarHorizontal = _YY2UXBEBcjs.useStoreState.call(void 0, 
      parentMenubar,
      (state) => !!state && state.orientation !== "vertical"
    );
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      if (hasParentMenu || parentMenubar && !isHorizontal) {
        const hideMap = {
          ArrowRight: () => dir === "left" && !isHorizontal,
          ArrowLeft: () => dir === "right" && !isHorizontal,
          ArrowUp: () => dir === "bottom" && isHorizontal,
          ArrowDown: () => dir === "top" && isHorizontal
        };
        const action = hideMap[event.key];
        if (action == null ? void 0 : action()) {
          event.stopPropagation();
          event.preventDefault();
          return store == null ? void 0 : store.hide();
        }
      }
      if (parentMenubar) {
        const keyMap = {
          ArrowRight: () => {
            if (!isMenubarHorizontal) return;
            return parentMenubar.next();
          },
          ArrowLeft: () => {
            if (!isMenubarHorizontal) return;
            return parentMenubar.previous();
          },
          ArrowDown: () => {
            if (isMenubarHorizontal) return;
            return parentMenubar.next();
          },
          ArrowUp: () => {
            if (isMenubarHorizontal) return;
            return parentMenubar.previous();
          }
        };
        const action = keyMap[event.key];
        const id2 = action == null ? void 0 : action();
        if (id2 !== void 0) {
          event.stopPropagation();
          event.preventDefault();
          parentMenubar.move(id2);
        }
      }
    });
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _JJQSOPYIcjs.MenuScopedContextProvider, { value: store, children: element }),
      [store]
    );
    const ariaLabelledBy = useAriaLabelledBy({ store, ...props });
    const mounted = store.useState("mounted");
    const hidden = _3ZDSDKC6cjs.isHidden.call(void 0, mounted, props.hidden, alwaysVisible);
    const style = hidden ? { ...props.style, display: "none" } : props.style;
    props = {
      id,
      "aria-labelledby": ariaLabelledBy,
      hidden,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, id ? store.setContentElement : null, props.ref),
      style,
      onKeyDown
    };
    const hasCombobox = !!store.combobox;
    composite = composite != null ? composite : !hasCombobox;
    if (composite) {
      props = {
        role: "menu",
        "aria-orientation": orientation,
        ...props
      };
    }
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, composite, ...props });
    props = _7WQJLR5Ucjs.useCompositeTypeahead.call(void 0, { store, typeahead: !hasCombobox, ...props });
    return props;
  }
);
var MenuList = _743QABRAcjs.forwardRef.call(void 0, function MenuList2(props) {
  const htmlProps = useMenuList(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useMenuList = useMenuList; exports.MenuList = MenuList;
