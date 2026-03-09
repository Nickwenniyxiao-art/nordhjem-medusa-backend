"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _CFNQ2EAVcjs = require('./CFNQ2EAV.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/button/button.tsx
var _dom = require('@ariakit/core/utils/dom');
var _react = require('react');
var TagName = "button";
var useButton = _743QABRAcjs.createHook.call(void 0, 
  function useButton2(props) {
    const ref = _react.useRef.call(void 0, null);
    const tagName = _KGFTRA3Ccjs.useTagName.call(void 0, ref, TagName);
    const [isNativeButton, setIsNativeButton] = _react.useState.call(void 0, 
      () => !!tagName && _dom.isButton.call(void 0, { tagName, type: props.type })
    );
    _react.useEffect.call(void 0, () => {
      if (!ref.current) return;
      setIsNativeButton(_dom.isButton.call(void 0, ref.current));
    }, []);
    props = {
      role: !isNativeButton && tagName !== "a" ? "button" : void 0,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
    };
    props = _CFNQ2EAVcjs.useCommand.call(void 0, props);
    return props;
  }
);
var Button = _743QABRAcjs.forwardRef.call(void 0, function Button2(props) {
  const htmlProps = useButton(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useButton = useButton; exports.Button = Button;
