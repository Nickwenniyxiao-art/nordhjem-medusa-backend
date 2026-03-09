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

// src/form/form-submit.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "button";
var useFormSubmit = _743QABRAcjs.createHook.call(void 0, 
  function useFormSubmit2({ store, accessibleWhenDisabled = true, ...props }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormSubmit must be wrapped in a Form component."
    );
    props = {
      type: "submit",
      disabled: store.useState("submitting"),
      ...props
    };
    props = _DIWKSV34cjs.useButton.call(void 0, { ...props, accessibleWhenDisabled });
    return props;
  }
);
var FormSubmit = _743QABRAcjs.forwardRef.call(void 0, function FormSubmit2(props) {
  const htmlProps = useFormSubmit(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FormSubmit = FormSubmit; exports.useFormSubmit = useFormSubmit;
