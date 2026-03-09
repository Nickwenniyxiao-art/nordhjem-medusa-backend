"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _VQNB6TQGcjs = require('./VQNB6TQG.cjs');


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/composite/composite-separator.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "hr";
var useCompositeSeparator = _743QABRAcjs.createHook.call(void 0, function useCompositeSeparator2({ store, ...props }) {
  const context = _WI7QXQL7cjs.useCompositeContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "CompositeSeparator must be wrapped in a Composite component."
  );
  const orientation = store.useState(
    (state) => state.orientation === "horizontal" ? "vertical" : "horizontal"
  );
  props = _VQNB6TQGcjs.useSeparator.call(void 0, { ...props, orientation });
  return props;
});
var CompositeSeparator = _743QABRAcjs.forwardRef.call(void 0, function CompositeSeparator2(props) {
  const htmlProps = useCompositeSeparator(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCompositeSeparator = useCompositeSeparator; exports.CompositeSeparator = CompositeSeparator;
