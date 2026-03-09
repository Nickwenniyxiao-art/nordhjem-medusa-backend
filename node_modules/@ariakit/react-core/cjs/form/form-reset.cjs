"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');


var _DIWKSV34cjs = require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-reset.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "button";
var useFormReset = _743QABRAcjs.createHook.call(void 0, 
  function useFormReset2({ store, ...props }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormReset must be wrapped in a Form component."
    );
    props = {
      type: "reset",
      disabled: store.useState("submitting"),
      ...props
    };
    props = _DIWKSV34cjs.useButton.call(void 0, props);
    return props;
  }
);
var FormReset = _743QABRAcjs.forwardRef.call(void 0, function FormReset2(props) {
  const htmlProps = useFormReset(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FormReset = FormReset; exports.useFormReset = useFormReset;
