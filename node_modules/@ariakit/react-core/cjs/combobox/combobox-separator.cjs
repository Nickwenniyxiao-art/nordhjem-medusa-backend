"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _OAFCIJ5Xcjs = require('../__chunks/OAFCIJ5X.cjs');
require('../__chunks/VQNB6TQG.cjs');


var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-separator.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "hr";
var useComboboxSeparator = _743QABRAcjs.createHook.call(void 0, function useComboboxSeparator2({ store, ...props }) {
  const context = _MLRWKUIEcjs.useComboboxScopedContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "ComboboxSeparator must be wrapped in a ComboboxList or ComboboxPopover component."
  );
  props = _OAFCIJ5Xcjs.useCompositeSeparator.call(void 0, { store, ...props });
  return props;
});
var ComboboxSeparator = _743QABRAcjs.forwardRef.call(void 0, function ComboboxSeparator2(props) {
  const htmlProps = useComboboxSeparator(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ComboboxSeparator = ComboboxSeparator; exports.useComboboxSeparator = useComboboxSeparator;
