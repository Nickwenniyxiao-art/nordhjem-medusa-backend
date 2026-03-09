"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _567HKB5Ncjs = require('../__chunks/567HKB5N.cjs');


var _YTQONGS5cjs = require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/radio/radio-group.tsx
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useRadioGroup = _743QABRAcjs.createHook.call(void 0, 
  function useRadioGroup2({ store, ...props }) {
    const context = _567HKB5Ncjs.useRadioProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "RadioGroup must receive a `store` prop or be wrapped in a RadioProvider component."
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _567HKB5Ncjs.RadioScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      role: "radiogroup",
      ...props
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, ...props });
    return props;
  }
);
var RadioGroup = _743QABRAcjs.forwardRef.call(void 0, function RadioGroup2(props) {
  const htmlProps = useRadioGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.RadioGroup = RadioGroup; exports.useRadioGroup = useRadioGroup;
