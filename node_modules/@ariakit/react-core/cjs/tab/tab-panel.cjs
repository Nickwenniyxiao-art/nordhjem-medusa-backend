"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _L5UNQIH6cjs = require('../__chunks/L5UNQIH6.cjs');


var _3ZDSDKC6cjs = require('../__chunks/3ZDSDKC6.cjs');


var _HQBHIWZXcjs = require('../__chunks/HQBHIWZX.cjs');


var _UUGJI255cjs = require('../__chunks/UUGJI255.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _4JH5Q6AQcjs = require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');





var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tab/tab-panel.tsx
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useTabPanel = _743QABRAcjs.createHook.call(void 0, 
  function useTabPanel2({
    store,
    unmountOnHide,
    tabId: tabIdProp,
    getItem: getItemProp,
    scrollRestoration,
    scrollElement,
    ...props
  }) {
    const context = _L5UNQIH6cjs.useTabProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TabPanel must receive a `store` prop or be wrapped in a TabProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const tabId = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store.panels,
      () => {
        var _a;
        return tabIdProp || ((_a = store == null ? void 0 : store.panels.item(id)) == null ? void 0 : _a.tabId);
      }
    );
    const open = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store,
      (state) => !!tabId && state.selectedId === tabId
    );
    const disclosure = _HQBHIWZXcjs.useDisclosureStore.call(void 0, { open });
    const mounted = _YY2UXBEBcjs.useStoreState.call(void 0, disclosure, "mounted");
    const scrollPositionRef = _react.useRef.call(void 0, 
      /* @__PURE__ */ new Map()
    );
    const getScrollElement = _KGFTRA3Ccjs.useEvent.call(void 0, () => {
      const panelElement = ref.current;
      if (!panelElement) return null;
      if (!scrollElement) return panelElement;
      if (typeof scrollElement === "function") {
        return scrollElement(panelElement);
      }
      if ("current" in scrollElement) {
        return scrollElement.current;
      }
      return scrollElement;
    });
    _react.useEffect.call(void 0, () => {
      var _a, _b;
      if (!scrollRestoration) return;
      if (!mounted) return;
      const element = getScrollElement();
      if (!element) return;
      if (scrollRestoration === "reset") {
        element.scroll(0, 0);
        return;
      }
      if (!tabId) return;
      const position = scrollPositionRef.current.get(tabId);
      element.scroll((_a = position == null ? void 0 : position.x) != null ? _a : 0, (_b = position == null ? void 0 : position.y) != null ? _b : 0);
      const onScroll = () => {
        scrollPositionRef.current.set(tabId, {
          x: element.scrollLeft,
          y: element.scrollTop
        });
      };
      element.addEventListener("scroll", onScroll);
      return () => {
        element.removeEventListener("scroll", onScroll);
      };
    }, [scrollRestoration, mounted, tabId, getScrollElement, store]);
    const [hasTabbableChildren, setHasTabbableChildren] = _react.useState.call(void 0, false);
    _react.useEffect.call(void 0, () => {
      const element = ref.current;
      if (!element) return;
      const tabbable = _focus.getAllTabbableIn.call(void 0, element);
      setHasTabbableChildren(!!tabbable.length);
    }, []);
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = { ...item, id: id || item.id, tabId: tabIdProp };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, tabIdProp, getItemProp]
    );
    const onKeyDownProp = props.onKeyDown;
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      if (!(store == null ? void 0 : store.composite)) return;
      const keyMap = {
        ArrowLeft: store.previous,
        ArrowRight: store.next,
        Home: store.first,
        End: store.last
      };
      const action = keyMap[event.key];
      if (!action) return;
      const { selectedId } = store.getState();
      const nextId = action({ activeId: selectedId });
      if (!nextId) return;
      event.preventDefault();
      store.move(nextId);
    });
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L5UNQIH6cjs.TabScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      id,
      role: "tabpanel",
      "aria-labelledby": tabId || void 0,
      ...props,
      children: unmountOnHide && !mounted ? null : props.children,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onKeyDown
    };
    props = _4JH5Q6AQcjs.useFocusable.call(void 0, {
      // If the tab panel is rendered as part of another composite widget such
      // as combobox, it should not be focusable.
      focusable: !store.composite && !hasTabbableChildren,
      ...props
    });
    props = _3ZDSDKC6cjs.useDisclosureContent.call(void 0, { store: disclosure, ...props });
    props = _UUGJI255cjs.useCollectionItem.call(void 0, { store: store.panels, ...props, getItem });
    return props;
  }
);
var TabPanel = _743QABRAcjs.forwardRef.call(void 0, function TabPanel2(props) {
  const htmlProps = useTabPanel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TabPanel = TabPanel; exports.useTabPanel = useTabPanel;
