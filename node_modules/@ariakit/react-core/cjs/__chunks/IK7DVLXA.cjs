"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _XRATBFDXcjs = require('./XRATBFDX.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/group/group-label.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
var useGroupLabel = _743QABRAcjs.createHook.call(void 0, 
  function useGroupLabel2(props) {
    const setLabelId = _react.useContext.call(void 0, _XRATBFDXcjs.GroupLabelContext);
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      setLabelId == null ? void 0 : setLabelId(id);
      return () => setLabelId == null ? void 0 : setLabelId(void 0);
    }, [setLabelId, id]);
    props = {
      id,
      "aria-hidden": true,
      ...props
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var GroupLabel = _743QABRAcjs.forwardRef.call(void 0, function GroupLabel2(props) {
  const htmlProps = useGroupLabel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useGroupLabel = useGroupLabel; exports.GroupLabel = GroupLabel;
