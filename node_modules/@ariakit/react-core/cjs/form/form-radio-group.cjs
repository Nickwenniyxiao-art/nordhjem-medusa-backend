"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _CGGSN7G5cjs = require('../__chunks/CGGSN7G5.cjs');
require('../__chunks/62RIM242.cjs');
require('../__chunks/XRATBFDX.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-radio-group.tsx
var TagName = "div";
var useFormRadioGroup = _743QABRAcjs.createHook.call(void 0, 
  function useFormRadioGroup2({ store, ...props }) {
    props = { role: "radiogroup", ...props };
    props = _CGGSN7G5cjs.useFormGroup.call(void 0, props);
    return props;
  }
);
var FormRadioGroup = _743QABRAcjs.forwardRef.call(void 0, function FormRadioGroup2(props) {
  const htmlProps = useFormRadioGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FormRadioGroup = FormRadioGroup; exports.useFormRadioGroup = useFormRadioGroup;
