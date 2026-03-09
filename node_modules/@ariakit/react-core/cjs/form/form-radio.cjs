"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _Z6JUQCZEcjs = require('../__chunks/Z6JUQCZE.cjs');
require('../__chunks/567HKB5N.cjs');


var _ZHCGZMXHcjs = require('../__chunks/ZHCGZMXH.cjs');


var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-radio.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "input";
var useFormRadio = _743QABRAcjs.createHook.call(void 0, 
  function useFormRadio2({ store, name: nameProp, value, ...props }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormRadio must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const onChangeProp = props.onChange;
    const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.setValue(name, value);
    });
    const checkedProp = props.checked;
    const checked = store.useState(
      () => checkedProp != null ? checkedProp : (store == null ? void 0 : store.getValue(name)) === value
    );
    props = {
      ...props,
      checked,
      onChange
    };
    props = _Z6JUQCZEcjs.useRadio.call(void 0, { value, ...props });
    props = _ZHCGZMXHcjs.useFormControl.call(void 0, {
      store,
      name,
      "aria-labelledby": void 0,
      ...props
    });
    return props;
  }
);
var FormRadio = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormRadio2(props) {
    const htmlProps = useFormRadio(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormRadio = FormRadio; exports.useFormRadio = useFormRadio;
