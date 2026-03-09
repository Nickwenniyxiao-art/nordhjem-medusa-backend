"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _WMMRPEHOcjs = require('../__chunks/WMMRPEHO.cjs');
require('../__chunks/IK7DVLXA.cjs');
require('../__chunks/XRATBFDX.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-group-label.tsx
var TagName = "div";
var useSelectGroupLabel = _743QABRAcjs.createHook.call(void 0, 
  function useSelectGroupLabel2(props) {
    props = _WMMRPEHOcjs.useCompositeGroupLabel.call(void 0, props);
    return props;
  }
);
var SelectGroupLabel = _743QABRAcjs.forwardRef.call(void 0, function SelectGroupLabel2(props) {
  const htmlProps = useSelectGroupLabel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.SelectGroupLabel = SelectGroupLabel; exports.useSelectGroupLabel = useSelectGroupLabel;
