"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');


var _UUGJI255cjs = require('../__chunks/UUGJI255.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-error.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
var useFormError = _743QABRAcjs.createHook.call(void 0, 
  function useFormError2({
    store,
    name: nameProp,
    getItem: getItemProp,
    ...props
  }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormError must be wrapped in a Form component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const ref = _react.useRef.call(void 0, null);
    const name = `${nameProp}`;
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "error" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp]
    );
    const children = store.useState(() => {
      const error = store == null ? void 0 : store.getError(name);
      if (error == null) return;
      if (!(store == null ? void 0 : store.getFieldTouched(name))) return;
      return error;
    });
    props = {
      id,
      role: "alert",
      children,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
    };
    props = _UUGJI255cjs.useCollectionItem.call(void 0, { store, ...props, getItem });
    return props;
  }
);
var FormError = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormError2(props) {
    const htmlProps = useFormError(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormError = FormError; exports.useFormError = useFormError;
