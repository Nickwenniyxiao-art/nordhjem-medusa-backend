"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _L6CLLK7Rcjs = require('./L6CLLK7R.cjs');



var _6N7G7IZOcjs = require('./6N7G7IZO.cjs');


var _J7ATZCFKcjs = require('./J7ATZCFK.cjs');


var _ANHHZKY4cjs = require('./ANHHZKY4.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');









var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/hovercard/hovercard.tsx
var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _focus = require('@ariakit/core/utils/focus');




var _misc = require('@ariakit/core/utils/misc');
var _store = require('@ariakit/core/utils/store');







var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function isMovingOnHovercard(target, card, anchor, nested) {
  if (_focus.hasFocusWithin.call(void 0, card)) return true;
  if (!target) return false;
  if (_dom.contains.call(void 0, card, target)) return true;
  if (anchor && _dom.contains.call(void 0, anchor, target)) return true;
  if (nested == null ? void 0 : nested.some((card2) => isMovingOnHovercard(target, card2, anchor))) {
    return true;
  }
  return false;
}
function useAutoFocusOnHide({
  store,
  ...props
}) {
  const [autoFocusOnHide, setAutoFocusOnHide] = _react.useState.call(void 0, false);
  const mounted = store.useState("mounted");
  _react.useEffect.call(void 0, () => {
    if (!mounted) {
      setAutoFocusOnHide(false);
    }
  }, [mounted]);
  const onFocusProp = props.onFocus;
  const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    setAutoFocusOnHide(true);
  });
  const finalFocusRef = _react.useRef.call(void 0, null);
  _react.useEffect.call(void 0, () => {
    return _store.sync.call(void 0, store, ["anchorElement"], (state) => {
      finalFocusRef.current = state.anchorElement;
    });
  }, []);
  props = {
    autoFocusOnHide,
    finalFocus: finalFocusRef,
    ...props,
    onFocus
  };
  return props;
}
var NestedHovercardContext = _react.createContext.call(void 0, null);
var useHovercard = _743QABRAcjs.createHook.call(void 0, 
  function useHovercard2({
    store,
    modal = false,
    portal = !!modal,
    hideOnEscape = true,
    hideOnHoverOutside = true,
    disablePointerEventsOnApproach = !!hideOnHoverOutside,
    ...props
  }) {
    const context = _6N7G7IZOcjs.useHovercardProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "Hovercard must receive a `store` prop or be wrapped in a HovercardProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const [nestedHovercards, setNestedHovercards] = _react.useState.call(void 0, []);
    const hideTimeoutRef = _react.useRef.call(void 0, 0);
    const enterPointRef = _react.useRef.call(void 0, null);
    const { portalRef, domReady } = _KGFTRA3Ccjs.usePortalRef.call(void 0, portal, props.portalRef);
    const isMouseMoving = _KGFTRA3Ccjs.useIsMouseMoving.call(void 0, );
    const mayHideOnHoverOutside = !!hideOnHoverOutside;
    const hideOnHoverOutsideProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, hideOnHoverOutside);
    const mayDisablePointerEvents = !!disablePointerEventsOnApproach;
    const disablePointerEventsProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, 
      disablePointerEventsOnApproach
    );
    const open = store.useState("open");
    const mounted = store.useState("mounted");
    _react.useEffect.call(void 0, () => {
      if (!domReady) return;
      if (!mounted) return;
      if (!mayHideOnHoverOutside && !mayDisablePointerEvents) return;
      const element = ref.current;
      if (!element) return;
      const onMouseMove = (event) => {
        if (!store) return;
        if (!isMouseMoving()) return;
        const { anchorElement, hideTimeout, timeout } = store.getState();
        const enterPoint = enterPointRef.current;
        const [target] = event.composedPath();
        const anchor = anchorElement;
        if (isMovingOnHovercard(target, element, anchor, nestedHovercards)) {
          enterPointRef.current = target && anchor && _dom.contains.call(void 0, anchor, target) ? _L6CLLK7Rcjs.getEventPoint.call(void 0, event) : null;
          window.clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = 0;
          return;
        }
        if (hideTimeoutRef.current) return;
        if (enterPoint) {
          const currentPoint = _L6CLLK7Rcjs.getEventPoint.call(void 0, event);
          const polygon = _L6CLLK7Rcjs.getElementPolygon.call(void 0, element, enterPoint);
          if (_L6CLLK7Rcjs.isPointInPolygon.call(void 0, currentPoint, polygon)) {
            enterPointRef.current = currentPoint;
            if (!disablePointerEventsProp(event)) return;
            event.preventDefault();
            event.stopPropagation();
            return;
          }
        }
        if (!hideOnHoverOutsideProp(event)) return;
        hideTimeoutRef.current = window.setTimeout(() => {
          hideTimeoutRef.current = 0;
          store == null ? void 0 : store.hide();
        }, hideTimeout != null ? hideTimeout : timeout);
      };
      return _misc.chain.call(void 0, 
        _events.addGlobalEventListener.call(void 0, "mousemove", onMouseMove, true),
        () => clearTimeout(hideTimeoutRef.current)
      );
    }, [
      store,
      isMouseMoving,
      domReady,
      mounted,
      mayHideOnHoverOutside,
      mayDisablePointerEvents,
      nestedHovercards,
      disablePointerEventsProp,
      hideOnHoverOutsideProp
    ]);
    _react.useEffect.call(void 0, () => {
      if (!domReady) return;
      if (!mounted) return;
      if (!mayDisablePointerEvents) return;
      const disableEvent = (event) => {
        const element = ref.current;
        if (!element) return;
        const enterPoint = enterPointRef.current;
        if (!enterPoint) return;
        const polygon = _L6CLLK7Rcjs.getElementPolygon.call(void 0, element, enterPoint);
        if (_L6CLLK7Rcjs.isPointInPolygon.call(void 0, _L6CLLK7Rcjs.getEventPoint.call(void 0, event), polygon)) {
          if (!disablePointerEventsProp(event)) return;
          event.preventDefault();
          event.stopPropagation();
        }
      };
      return _misc.chain.call(void 0, 
        // Note: we may need to add pointer events here in the future.
        _events.addGlobalEventListener.call(void 0, "mouseenter", disableEvent, true),
        _events.addGlobalEventListener.call(void 0, "mouseover", disableEvent, true),
        _events.addGlobalEventListener.call(void 0, "mouseout", disableEvent, true),
        _events.addGlobalEventListener.call(void 0, "mouseleave", disableEvent, true)
      );
    }, [domReady, mounted, mayDisablePointerEvents, disablePointerEventsProp]);
    _react.useEffect.call(void 0, () => {
      if (!domReady) return;
      if (open) return;
      store == null ? void 0 : store.setAutoFocusOnShow(false);
    }, [store, domReady, open]);
    const openRef = _KGFTRA3Ccjs.useLiveRef.call(void 0, open);
    _react.useEffect.call(void 0, () => {
      if (!domReady) return;
      return () => {
        if (!openRef.current) {
          store == null ? void 0 : store.setAutoFocusOnShow(false);
        }
      };
    }, [store, domReady]);
    const registerOnParent = _react.useContext.call(void 0, NestedHovercardContext);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      if (modal) return;
      if (!portal) return;
      if (!mounted) return;
      if (!domReady) return;
      const element = ref.current;
      if (!element) return;
      return registerOnParent == null ? void 0 : registerOnParent(element);
    }, [modal, portal, mounted, domReady]);
    const registerNestedHovercard = _react.useCallback.call(void 0, 
      (element) => {
        setNestedHovercards((prevElements) => [...prevElements, element]);
        const parentUnregister = registerOnParent == null ? void 0 : registerOnParent(element);
        return () => {
          setNestedHovercards(
            (prevElements) => prevElements.filter((item) => item !== element)
          );
          parentUnregister == null ? void 0 : parentUnregister();
        };
      },
      [registerOnParent]
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _6N7G7IZOcjs.HovercardScopedContextProvider, { value: store, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, NestedHovercardContext.Provider, { value: registerNestedHovercard, children: element }) }),
      [store, registerNestedHovercard]
    );
    props = {
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
    };
    props = useAutoFocusOnHide({ store, ...props });
    const autoFocusOnShow = store.useState(
      (state) => modal || state.autoFocusOnShow
    );
    props = _J7ATZCFKcjs.usePopover.call(void 0, {
      store,
      modal,
      portal,
      autoFocusOnShow,
      ...props,
      portalRef,
      hideOnEscape(event) {
        if (_misc.isFalsyBooleanCallback.call(void 0, hideOnEscape, event)) return false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            store == null ? void 0 : store.hide();
          });
        });
        return true;
      }
    });
    return props;
  }
);
var Hovercard = _ANHHZKY4cjs.createDialogComponent.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Hovercard2(props) {
    const htmlProps = useHovercard(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _6N7G7IZOcjs.useHovercardProviderContext
);




exports.useHovercard = useHovercard; exports.Hovercard = Hovercard;
