"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _IK7DVLXAcjs = require('./IK7DVLXA.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/composite/composite-group-label.tsx
var TagName = "div";
var useCompositeGroupLabel = _743QABRAcjs.createHook.call(void 0, function useCompositeGroupLabel2({ store, ...props }) {
  props = _IK7DVLXAcjs.useGroupLabel.call(void 0, props);
  return props;
});
var CompositeGroupLabel = _743QABRAcjs.forwardRef.call(void 0, function CompositeGroupLabel2(props) {
  const htmlProps = useCompositeGroupLabel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCompositeGroupLabel = useCompositeGroupLabel; exports.CompositeGroupLabel = CompositeGroupLabel;
