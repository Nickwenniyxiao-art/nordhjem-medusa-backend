"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-label.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "label";
var useComboboxLabel = _743QABRAcjs.createHook.call(void 0, 
  function useComboboxLabel2({ store, ...props }) {
    const context = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "ComboboxLabel must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const comboboxId = store.useState((state) => {
      var _a;
      return (_a = state.baseElement) == null ? void 0 : _a.id;
    });
    props = {
      htmlFor: comboboxId,
      ...props
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var ComboboxLabel = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function ComboboxLabel2(props) {
    const htmlProps = useComboboxLabel(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.ComboboxLabel = ComboboxLabel; exports.useComboboxLabel = useComboboxLabel;
