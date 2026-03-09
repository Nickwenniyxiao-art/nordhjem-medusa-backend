"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _V4CSM2URcjs = require('../__chunks/V4CSM2UR.cjs');
require('../__chunks/YQMDNMVH.cjs');
require('../__chunks/HY6WXQ7B.cjs');
require('../__chunks/NRJF3KTK.cjs');


var _WS3AS5PBcjs = require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/composite/composite-overflow-disclosure.ts
var _store = require('@ariakit/core/utils/store');
var _react = require('react');
var TagName = "button";
var useCompositeOverflowDisclosure = _743QABRAcjs.createHook.call(void 0, function useCompositeOverflowDisclosure2({ store, ...props }) {
  const ref = _react.useRef.call(void 0, null);
  const [shouldRegisterItem, setShouldRegisterItem] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    return _store.sync.call(void 0, store, ["disclosureElement"], () => {
      store.setDisclosureElement(ref.current);
    });
  }, [store]);
  const onFocusProp = props.onFocus;
  const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    setShouldRegisterItem(true);
  });
  const onBlurProp = props.onBlur;
  const onBlur = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onBlurProp == null ? void 0 : onBlurProp(event);
    if (event.defaultPrevented) return;
    setShouldRegisterItem(false);
  });
  props = {
    "aria-hidden": !shouldRegisterItem,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, props.ref, ref),
    onFocus,
    onBlur
  };
  props = _WS3AS5PBcjs.useCompositeItem.call(void 0, { ...props, shouldRegisterItem });
  props = _V4CSM2URcjs.usePopoverDisclosure.call(void 0, { store, ...props });
  return props;
});
var CompositeOverflowDisclosure = _743QABRAcjs.forwardRef.call(void 0, 
  function CompositeOverflowDisclosure2(props) {
    const htmlProps = useCompositeOverflowDisclosure(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }
);



exports.CompositeOverflowDisclosure = CompositeOverflowDisclosure; exports.useCompositeOverflowDisclosure = useCompositeOverflowDisclosure;
