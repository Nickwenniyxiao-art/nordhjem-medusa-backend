"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZHCGZMXHcjs = require('../__chunks/ZHCGZMXH.cjs');


var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');
require('../__chunks/UUGJI255.cjs');


var _4JH5Q6AQcjs = require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-input.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "input";
var useFormInput = _743QABRAcjs.createHook.call(void 0, 
  function useFormInput2({ store, name: nameProp, ...props }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormInput must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const onChangeProp = props.onChange;
    const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setValue(name, event.target.value);
    });
    const value = store.useValue(name);
    props = {
      value,
      ...props,
      onChange
    };
    props = _4JH5Q6AQcjs.useFocusable.call(void 0, props);
    props = _ZHCGZMXHcjs.useFormControl.call(void 0, { store, name, ...props });
    return props;
  }
);
var FormInput = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormInput2(props) {
    const htmlProps = useFormInput(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormInput = FormInput; exports.useFormInput = useFormInput;
