"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _WS3AS5PBcjs = require('./WS3AS5PB.cjs');


var _57B3GSGZcjs = require('./57B3GSGZ.cjs');


var _L22B4P6Ycjs = require('./L22B4P6Y.cjs');


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/composite/composite-item-offscreen.tsx
var _dom = require('@ariakit/core/utils/dom');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
function useCompositeItemOffscreen({ store, offscreenBehavior = "active", disabled, value, ...props }) {
  const context = _WI7QXQL7cjs.useCompositeContext.call(void 0, );
  store = store || context;
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  const { storeId, active, listElement, offscreenRoot } = _YY2UXBEBcjs.useStoreStateObject.call(void 0, 
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
  const offscreenProps = _57B3GSGZcjs.useCollectionItemOffscreen.call(void 0, {
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
      role: _dom.getPopupItemRole.call(void 0, listElement),
      "aria-disabled": disabled || void 0,
      "data-offscreen-id": storeId
    };
  }
  return offscreenProps;
}
var CompositeItem2 = _743QABRAcjs.forwardRef.call(void 0, function CompositeItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useCompositeItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WS3AS5PBcjs.CompositeItem, { ...allProps });
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
  const Component = _L22B4P6Ycjs.Role[TagName];
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, { ...htmlProps });
});




exports.useCompositeItemOffscreen = useCompositeItemOffscreen; exports.CompositeItem = CompositeItem2;
