"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _IK7DVLXAcjs = require('../__chunks/IK7DVLXA.cjs');
require('../__chunks/XRATBFDX.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-group-label.tsx
var TagName = "div";
var useFormGroupLabel = _743QABRAcjs.createHook.call(void 0, 
  function useFormGroupLabel2({ store, ...props }) {
    props = _IK7DVLXAcjs.useGroupLabel.call(void 0, props);
    return props;
  }
);
var FormGroupLabel = _743QABRAcjs.forwardRef.call(void 0, function FormGroupLabel2(props) {
  const htmlProps = useFormGroupLabel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FormGroupLabel = FormGroupLabel; exports.useFormGroupLabel = useFormGroupLabel;
