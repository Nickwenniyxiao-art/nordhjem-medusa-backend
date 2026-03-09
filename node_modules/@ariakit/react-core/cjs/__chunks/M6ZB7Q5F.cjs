"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _6N7G7IZOcjs = require('./6N7G7IZO.cjs');


var _4JH5Q6AQcjs = require('./4JH5Q6AQ.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');





var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/hovercard/hovercard-anchor.tsx
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "a";
var useHovercardAnchor = _743QABRAcjs.createHook.call(void 0, 
  function useHovercardAnchor2({ store, showOnHover = true, ...props }) {
    const context = _6N7G7IZOcjs.useHovercardProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "HovercardAnchor must receive a `store` prop or be wrapped in a HovercardProvider component."
    );
    const disabled = _misc.disabledFromProps.call(void 0, props);
    const showTimeoutRef = _react.useRef.call(void 0, 0);
    _react.useEffect.call(void 0, () => () => window.clearTimeout(showTimeoutRef.current), []);
    _react.useEffect.call(void 0, () => {
      const onMouseLeave = (event) => {
        if (!store) return;
        const { anchorElement } = store.getState();
        if (!anchorElement) return;
        if (event.target !== anchorElement) return;
        window.clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = 0;
      };
      return _events.addGlobalEventListener.call(void 0, "mouseleave", onMouseLeave, true);
    }, [store]);
    const onMouseMoveProp = props.onMouseMove;
    const showOnHoverProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, showOnHover);
    const isMouseMoving = _KGFTRA3Ccjs.useIsMouseMoving.call(void 0, );
    const onMouseMove = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onMouseMoveProp == null ? void 0 : onMouseMoveProp(event);
      if (disabled) return;
      if (!store) return;
      if (event.defaultPrevented) return;
      if (showTimeoutRef.current) return;
      if (!isMouseMoving()) return;
      if (!showOnHoverProp(event)) return;
      const element = event.currentTarget;
      store.setAnchorElement(element);
      store.setDisclosureElement(element);
      const { showTimeout, timeout } = store.getState();
      const showHovercard = () => {
        showTimeoutRef.current = 0;
        if (!isMouseMoving()) return;
        store == null ? void 0 : store.setAnchorElement(element);
        store == null ? void 0 : store.show();
        queueMicrotask(() => {
          store == null ? void 0 : store.setDisclosureElement(element);
        });
      };
      const timeoutMs = showTimeout != null ? showTimeout : timeout;
      if (timeoutMs === 0) {
        showHovercard();
      } else {
        showTimeoutRef.current = window.setTimeout(showHovercard, timeoutMs);
      }
    });
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (!store) return;
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = 0;
    });
    const ref = _react.useCallback.call(void 0, 
      (element) => {
        if (!store) return;
        const { anchorElement } = store.getState();
        if (anchorElement == null ? void 0 : anchorElement.isConnected) return;
        store.setAnchorElement(element);
      },
      [store]
    );
    props = {
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onMouseMove,
      onClick
    };
    props = _4JH5Q6AQcjs.useFocusable.call(void 0, props);
    return props;
  }
);
var HovercardAnchor = _743QABRAcjs.forwardRef.call(void 0, function HovercardAnchor2(props) {
  const htmlProps = useHovercardAnchor(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useHovercardAnchor = useHovercardAnchor; exports.HovercardAnchor = HovercardAnchor;
