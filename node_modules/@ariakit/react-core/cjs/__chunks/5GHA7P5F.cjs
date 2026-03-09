"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _62RIM242cjs = require('./62RIM242.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/composite/composite-group.tsx
var TagName = "div";
var useCompositeGroup = _743QABRAcjs.createHook.call(void 0, 
  function useCompositeGroup2({ store, ...props }) {
    props = _62RIM242cjs.useGroup.call(void 0, props);
    return props;
  }
);
var CompositeGroup = _743QABRAcjs.forwardRef.call(void 0, function CompositeGroup2(props) {
  const htmlProps = useCompositeGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCompositeGroup = useCompositeGroup; exports.CompositeGroup = CompositeGroup;
