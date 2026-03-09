"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _5BVSKVUNcjs = require('./5BVSKVUN.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/dialog/dialog-description.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "p";
var useDialogDescription = _743QABRAcjs.createHook.call(void 0, function useDialogDescription2({ store, ...props }) {
  const setDescriptionId = _react.useContext.call(void 0, _5BVSKVUNcjs.DialogDescriptionContext);
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    setDescriptionId == null ? void 0 : setDescriptionId(id);
    return () => setDescriptionId == null ? void 0 : setDescriptionId(void 0);
  }, [setDescriptionId, id]);
  props = {
    id,
    ...props
  };
  return _misc.removeUndefinedValues.call(void 0, props);
});
var DialogDescription = _743QABRAcjs.forwardRef.call(void 0, function DialogDescription2(props) {
  const htmlProps = useDialogDescription(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useDialogDescription = useDialogDescription; exports.DialogDescription = DialogDescription;
