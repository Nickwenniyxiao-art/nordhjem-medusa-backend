"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _XRATBFDXcjs = require('./XRATBFDX.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/group/group.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useGroup = _743QABRAcjs.createHook.call(void 0, 
  function useGroup2(props) {
    const [labelId, setLabelId] = _react.useState.call(void 0, );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _XRATBFDXcjs.GroupLabelContext.Provider, { value: setLabelId, children: element }),
      []
    );
    props = {
      role: "group",
      "aria-labelledby": labelId,
      ...props
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var Group = _743QABRAcjs.forwardRef.call(void 0, function Group2(props) {
  const htmlProps = useGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useGroup = useGroup; exports.Group = Group;
