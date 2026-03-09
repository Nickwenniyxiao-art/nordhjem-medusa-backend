"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _MIBORXQWcjs = require('../__chunks/MIBORXQW.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/composite/composite-input.tsx




var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "input";
function getValueLength(element) {
  if (_dom.isTextField.call(void 0, element)) {
    return element.value.length;
  } else if (element.isContentEditable) {
    const range = _dom.getDocument.call(void 0, element).createRange();
    range.selectNodeContents(element);
    return range.toString().length;
  }
  return 0;
}
var useCompositeInput = _743QABRAcjs.createHook.call(void 0, 
  function useCompositeInput2({ store, ...props }) {
    const onKeyDownCaptureProp = props.onKeyDownCapture;
    if (process.env.NODE_ENV !== "production") {
      _react.useEffect.call(void 0, () => {
        console.warn(
          "CompositeInput is deprecated. Use `<CompositeItem render={<input />}>` instead."
        );
      }, []);
    }
    const onKeyDownCapture = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownCaptureProp == null ? void 0 : onKeyDownCaptureProp(event);
      if (event.defaultPrevented) return;
      const element = event.currentTarget;
      if (!element.isContentEditable && !_dom.isTextField.call(void 0, element)) return;
      const selection = _dom.getTextboxSelection.call(void 0, element);
      const { orientation } = (store == null ? void 0 : store.getState()) || {};
      const isHorizontal = orientation !== "vertical";
      const isVertical = orientation !== "horizontal";
      const isLeft = isHorizontal && event.key === "ArrowLeft";
      const isRight = isHorizontal && event.key === "ArrowRight";
      const isUp = isVertical && event.key === "ArrowUp";
      const isDown = isVertical && event.key === "ArrowDown";
      if (isRight || isDown) {
        if (selection.end !== getValueLength(element)) {
          event.stopPropagation();
        }
      } else if (isLeft || isUp) {
        if (selection.start !== 0) {
          event.stopPropagation();
        }
      }
    });
    const onFocusProp = props.onFocus;
    const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onFocusProp == null ? void 0 : onFocusProp(event);
      if (event.defaultPrevented) return;
      _MIBORXQWcjs.selectTextField.call(void 0, event.currentTarget);
    });
    props = {
      ...props,
      onKeyDownCapture,
      onFocus
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var CompositeInput = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function CompositeInput2(props) {
    const htmlProps = useCompositeInput(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.CompositeInput = CompositeInput; exports.useCompositeInput = useCompositeInput;
