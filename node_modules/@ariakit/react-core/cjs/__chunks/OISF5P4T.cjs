"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _6AOESUW6cjs = require('./6AOESUW6.cjs');


var _5BVSKVUNcjs = require('./5BVSKVUN.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/dialog/dialog-heading.tsx
var _react = require('react');
var TagName = "h1";
var useDialogHeading = _743QABRAcjs.createHook.call(void 0, 
  function useDialogHeading2({ store, ...props }) {
    const setHeadingId = _react.useContext.call(void 0, _5BVSKVUNcjs.DialogHeadingContext);
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      setHeadingId == null ? void 0 : setHeadingId(id);
      return () => setHeadingId == null ? void 0 : setHeadingId(void 0);
    }, [setHeadingId, id]);
    props = {
      id,
      ...props
    };
    props = _6AOESUW6cjs.useHeading.call(void 0, props);
    return props;
  }
);
var DialogHeading = _743QABRAcjs.forwardRef.call(void 0, function DialogHeading2(props) {
  const htmlProps = useDialogHeading(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useDialogHeading = useDialogHeading; exports.DialogHeading = DialogHeading;
