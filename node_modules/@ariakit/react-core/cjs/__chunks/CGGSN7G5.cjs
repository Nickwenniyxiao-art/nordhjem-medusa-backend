"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _62RIM242cjs = require('./62RIM242.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/form/form-group.tsx
var TagName = "div";
var useFormGroup = _743QABRAcjs.createHook.call(void 0, 
  function useFormGroup2({ store, ...props }) {
    props = _62RIM242cjs.useGroup.call(void 0, props);
    return props;
  }
);
var FormGroup = _743QABRAcjs.forwardRef.call(void 0, function FormGroup2(props) {
  const htmlProps = useFormGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useFormGroup = useFormGroup; exports.FormGroup = FormGroup;
