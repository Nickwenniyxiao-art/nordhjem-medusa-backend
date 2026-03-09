"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _QHTB3O7Vcjs = require('../__chunks/QHTB3O7V.cjs');
require('../__chunks/IRJEBRAW.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-item-check.tsx
var _react = require('react');
var TagName = "span";
var useComboboxItemCheck = _743QABRAcjs.createHook.call(void 0, function useComboboxItemCheck2({ store, checked, ...props }) {
  const context = _react.useContext.call(void 0, _MLRWKUIEcjs.ComboboxItemCheckedContext);
  checked = checked != null ? checked : context;
  props = _QHTB3O7Vcjs.useCheckboxCheck.call(void 0, { ...props, checked });
  return props;
});
var ComboboxItemCheck = _743QABRAcjs.forwardRef.call(void 0, function ComboboxItemCheck2(props) {
  const htmlProps = useComboboxItemCheck(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ComboboxItemCheck = ComboboxItemCheck; exports.useComboboxItemCheck = useComboboxItemCheck;
