"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _QKNBVX3Ucjs = require('../__chunks/QKNBVX3U.cjs');


var _M6ZB7Q5Fcjs = require('../__chunks/M6ZB7Q5F.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tooltip/tooltip-anchor.tsx




var _misc = require('@ariakit/core/utils/misc');
var _store = require('@ariakit/core/utils/store');
var _react = require('react');
var TagName = "div";
var globalStore = _store.createStore.call(void 0, {
  activeStore: null
});
function createRemoveStoreCallback(store) {
  return () => {
    const { activeStore } = globalStore.getState();
    if (activeStore !== store) return;
    globalStore.setState("activeStore", null);
  };
}
var useTooltipAnchor = _743QABRAcjs.createHook.call(void 0, 
  function useTooltipAnchor2({ store, showOnHover = true, ...props }) {
    const context = _QKNBVX3Ucjs.useTooltipProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TooltipAnchor must receive a `store` prop or be wrapped in a TooltipProvider component."
    );
    const canShowOnHoverRef = _react.useRef.call(void 0, false);
    _react.useEffect.call(void 0, () => {
      return _store.sync.call(void 0, store, ["mounted"], (state) => {
        if (state.mounted) return;
        canShowOnHoverRef.current = false;
      });
    }, [store]);
    _react.useEffect.call(void 0, () => {
      if (!store) return;
      return _misc.chain.call(void 0, 
        // Immediately remove the current store from the global store when
        // the component unmounts. This is useful, for example, to avoid
        // showing tooltips immediately on serial tests.
        createRemoveStoreCallback(store),
        _store.sync.call(void 0, store, ["mounted", "skipTimeout"], (state) => {
          if (!store) return;
          if (state.mounted) {
            const { activeStore } = globalStore.getState();
            if (activeStore !== store) {
              activeStore == null ? void 0 : activeStore.hide();
            }
            return globalStore.setState("activeStore", store);
          }
          const id = setTimeout(
            createRemoveStoreCallback(store),
            state.skipTimeout
          );
          return () => clearTimeout(id);
        })
      );
    }, [store]);
    const onMouseEnterProp = props.onMouseEnter;
    const onMouseEnter = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onMouseEnterProp == null ? void 0 : onMouseEnterProp(event);
      canShowOnHoverRef.current = true;
    });
    const onFocusVisibleProp = props.onFocusVisible;
    const onFocusVisible = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onFocusVisibleProp == null ? void 0 : onFocusVisibleProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setAnchorElement(event.currentTarget);
      store == null ? void 0 : store.show();
    });
    const onBlurProp = props.onBlur;
    const onBlur = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onBlurProp == null ? void 0 : onBlurProp(event);
      if (event.defaultPrevented) return;
      const { activeStore } = globalStore.getState();
      canShowOnHoverRef.current = false;
      if (activeStore === store) {
        globalStore.setState("activeStore", null);
      }
    });
    const type = store.useState("type");
    const contentId = store.useState((state) => {
      var _a;
      return (_a = state.contentElement) == null ? void 0 : _a.id;
    });
    props = {
      "aria-labelledby": type === "label" ? contentId : void 0,
      ...props,
      onMouseEnter,
      onFocusVisible,
      onBlur
    };
    props = _M6ZB7Q5Fcjs.useHovercardAnchor.call(void 0, {
      store,
      showOnHover(event) {
        if (!canShowOnHoverRef.current) return false;
        if (_misc.isFalsyBooleanCallback.call(void 0, showOnHover, event)) return false;
        const { activeStore } = globalStore.getState();
        if (!activeStore) return true;
        store == null ? void 0 : store.show();
        return false;
      },
      ...props
    });
    return props;
  }
);
var TooltipAnchor = _743QABRAcjs.forwardRef.call(void 0, function TooltipAnchor2(props) {
  const htmlProps = useTooltipAnchor(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TooltipAnchor = TooltipAnchor; exports.useTooltipAnchor = useTooltipAnchor;
