"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/composite/composite-row.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useCompositeRow = _743QABRAcjs.createHook.call(void 0, 
  function useCompositeRow2({
    store,
    "aria-setsize": ariaSetSize,
    "aria-posinset": ariaPosInSet,
    ...props
  }) {
    const context = _WI7QXQL7cjs.useCompositeContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "CompositeRow must be wrapped in a Composite component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const baseElement = store.useState(
      (state) => state.baseElement || void 0
    );
    const providerValue = _react.useMemo.call(void 0, 
      () => ({ id, baseElement, ariaSetSize, ariaPosInSet }),
      [id, baseElement, ariaSetSize, ariaPosInSet]
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WI7QXQL7cjs.CompositeRowContext.Provider, { value: providerValue, children: element }),
      [providerValue]
    );
    props = { id, ...props };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var CompositeRow = _743QABRAcjs.forwardRef.call(void 0, function CompositeRow2(props) {
  const htmlProps = useCompositeRow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCompositeRow = useCompositeRow; exports.CompositeRow = CompositeRow;
