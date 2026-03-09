"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _L22B4P6Ycjs = require('./L22B4P6Y.cjs');


var _UUGJI255cjs = require('./UUGJI255.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');




var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/collection/collection-item-offscreen.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function requestIdleCallback(callback) {
  if (typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(callback);
  }
  callback();
  return 0;
}
function cancelIdleCallback(id) {
  if (typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(id);
  }
}
function useCollectionItemOffscreen({ offscreenBehavior = "active", offscreenRoot, ...props }) {
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  const [updated, forceUpdate] = _KGFTRA3Ccjs.useForceUpdate.call(void 0, );
  const forcedUpdatesCountRef = _react.useRef.call(void 0, 0);
  const [_active, setActive] = _react.useState.call(void 0, offscreenBehavior === "active");
  const active = _active || offscreenBehavior === "active";
  const observerRef = _react.useRef.call(void 0, null);
  const idleCallbackIdRef = _react.useRef.call(void 0, 0);
  const ref = _react.useCallback.call(void 0, 
    (element) => {
      var _a;
      if (!element || offscreenBehavior === "active") {
        cancelIdleCallback(idleCallbackIdRef.current);
        (_a = observerRef.current) == null ? void 0 : _a.disconnect();
        return;
      }
      _misc.invariant.call(void 0, 
        offscreenRoot !== void 0,
        process.env.NODE_ENV !== "production" && "The offscreenRoot prop must provided."
      );
      const getOffscreenRoot = () => {
        if (!offscreenRoot) return null;
        if (typeof offscreenRoot === "function") {
          return offscreenRoot(element);
        }
        if ("current" in offscreenRoot) {
          return offscreenRoot.current;
        }
        return offscreenRoot;
      };
      const root = getOffscreenRoot();
      if (!root) {
        forcedUpdatesCountRef.current++;
        if (forcedUpdatesCountRef.current > 3) {
          throw new Error(
            "The offscreenRoot is not available. Please make sure the root element is mounted."
          );
        }
        forceUpdate();
        return;
      }
      if (!observerRef.current || observerRef.current.root !== root) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            cancelIdleCallback(idleCallbackIdRef.current);
            const isIntersecting = !!(entry == null ? void 0 : entry.isIntersecting);
            idleCallbackIdRef.current = requestIdleCallback(() => {
              if (!isIntersecting && offscreenBehavior === "lazy") return;
              setActive(isIntersecting);
            });
          },
          { root, rootMargin: "40%" }
        );
      }
      observerRef.current.observe(element);
    },
    [updated, offscreenBehavior, offscreenRoot]
  );
  return {
    id,
    active,
    ref,
    "data-offscreen": !active || void 0
  };
}
var CollectionItem2 = _743QABRAcjs.forwardRef.call(void 0, function CollectionItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useCollectionItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _UUGJI255cjs.CollectionItem, { ...allProps });
  }
  const {
    store,
    shouldRegisterItem,
    getItem,
    // @ts-expect-error This prop may come from a collection renderer.
    element,
    ...htmlProps
  } = allProps;
  const Component = _L22B4P6Ycjs.Role[TagName];
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, { ...htmlProps });
});




exports.useCollectionItemOffscreen = useCollectionItemOffscreen; exports.CollectionItem = CollectionItem2;
