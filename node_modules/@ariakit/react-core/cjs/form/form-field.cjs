"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZHCGZMXHcjs = require('../__chunks/ZHCGZMXH.cjs');
require('../__chunks/FHB7634O.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-field.tsx
var TagName = "input";
var useFormField = _743QABRAcjs.createHook.call(void 0, 
  function useFormField2(props) {
    return _ZHCGZMXHcjs.useFormControl.call(void 0, props);
  }
);
var FormField = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormField2(props) {
    const htmlProps = useFormField(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormField = FormField; exports.useFormField = useFormField;
