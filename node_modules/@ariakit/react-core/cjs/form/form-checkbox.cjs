"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZHCGZMXHcjs = require('../__chunks/ZHCGZMXH.cjs');


var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');
require('../__chunks/UUGJI255.cjs');


var _KDJ6FXQQcjs = require('../__chunks/KDJ6FXQQ.cjs');


var _L6J77MXFcjs = require('../__chunks/L6J77MXF.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/IRJEBRAW.cjs');
require('../__chunks/HNUUQ6LR.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-checkbox.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "input";
var useFormCheckbox = _743QABRAcjs.createHook.call(void 0, 
  function useFormCheckbox2({
    store,
    name: nameProp,
    value,
    checked,
    defaultChecked,
    ...props
  }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormCheckbox must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const checkboxStore = _KDJ6FXQQcjs.useCheckboxStore.call(void 0, {
      value: store.useValue(name),
      setValue: (value2) => store == null ? void 0 : store.setValue(name, value2)
    });
    props = _L6J77MXFcjs.useCheckbox.call(void 0, { store: checkboxStore, value, checked, ...props });
    props = _ZHCGZMXHcjs.useFormControl.call(void 0, {
      store,
      name,
      "aria-labelledby": void 0,
      ...props
    });
    return props;
  }
);
var FormCheckbox = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormCheckbox2(props) {
    const htmlProps = useFormCheckbox(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormCheckbox = FormCheckbox; exports.useFormCheckbox = useFormCheckbox;
