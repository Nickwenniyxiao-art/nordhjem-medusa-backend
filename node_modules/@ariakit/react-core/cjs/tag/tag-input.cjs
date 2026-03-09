"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');


var _WS3AS5PBcjs = require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');




var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag-input.tsx
var _array = require('@ariakit/core/utils/array');



var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _undo = require('@ariakit/core/utils/undo');
var TagName = "input";
var DEFAULT_DELIMITER = ["\n", ";", ",", /\s/];
function getDelimiters(delimiter, defaultDelimiter = DEFAULT_DELIMITER) {
  const finalDelimiter = delimiter === void 0 ? defaultDelimiter : delimiter;
  if (!finalDelimiter) return [];
  return _array.toArray.call(void 0, finalDelimiter);
}
function splitValueByDelimiter(value, delimiters) {
  for (const delimiter of delimiters) {
    let match = value.match(delimiter);
    while ((match == null ? void 0 : match.index) === 0) {
      value = value.slice(match[0].length);
      match = value.match(delimiter);
    }
    if (!match) continue;
    return value.split(delimiter);
  }
  return [];
}
var useTagInput = _743QABRAcjs.createHook.call(void 0, 
  function useTagInput2({
    store,
    tabbable = true,
    delimiter,
    addValueOnPaste = true,
    addValueOnChange = true,
    setValueOnChange = true,
    removeOnBackspace = true,
    ...props
  }) {
    const context = _THHAUPXTcjs.useTagContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TagInput must receive a `store` prop or be wrapped in a TagProvider component."
    );
    const value = _YY2UXBEBcjs.useStoreState.call(void 0, store, "value");
    const onPasteProp = props.onPaste;
    const addValueOnPasteProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, addValueOnPaste);
    const onPaste = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onPasteProp == null ? void 0 : onPasteProp(event);
      if (event.defaultPrevented) return;
      const text = event.clipboardData.getData("text");
      const delimiters = getDelimiters(delimiter);
      const values = splitValueByDelimiter(text.trim(), delimiters).map((value2) => value2.trim()).filter((value2) => value2 !== "");
      const eventWithValues = Object.assign(event, { values });
      if (!addValueOnPasteProp(eventWithValues)) return;
      if (!values.length) return;
      event.preventDefault();
      for (const tagValue of values) {
        store.addValue(tagValue);
      }
    });
    const onChangeProp = props.onChange;
    const setValueOnChangeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, setValueOnChange);
    const addValueOnChangeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, addValueOnChange);
    const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      if (!store) return;
      const { value: prevValue } = store.getState();
      const inputType = _events.getInputType.call(void 0, event);
      const currentTarget = event.currentTarget;
      const { start, end } = _dom.getTextboxSelection.call(void 0, currentTarget);
      const { value: value2 } = currentTarget;
      if (setValueOnChangeProp(event)) {
        _undo.UndoManager.execute(() => {
          store.setValue(value2);
          queueMicrotask(() => {
            _dom.setSelectionRange.call(void 0, currentTarget, start, end);
          });
          if (value2 === prevValue) return;
          return () => store.setValue(prevValue);
        }, inputType);
      }
      const isTrailingCaret = start === end && start === value2.length;
      if (isTrailingCaret) {
        const delimiters = getDelimiters(delimiter);
        let values = splitValueByDelimiter(value2, delimiters);
        const trailingvalue = values.pop() || "";
        values = values.map((value3) => value3.trim()).filter((value3) => value3 !== "");
        const eventWithValues = Object.assign(event, { values });
        if (values.length && addValueOnChangeProp(eventWithValues)) {
          event.preventDefault();
          for (const tagValue of values) {
            store.addValue(tagValue);
          }
          _undo.UndoManager.execute(() => {
            store.setValue(trailingvalue);
            if (trailingvalue === prevValue) return;
            return () => store.setValue(prevValue);
          }, inputType);
        }
      }
    });
    const onKeyDownProp = props.onKeyDown;
    const removeOnBackspaceProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, removeOnBackspace);
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      if (event.key === "Backspace" && removeOnBackspaceProp(event)) {
        const { start, end } = _dom.getTextboxSelection.call(void 0, event.currentTarget);
        const isLeadingCaret = start === end && start === 0;
        if (!isLeadingCaret) return;
        store.setValues((values) => {
          if (!values.length) return values;
          return values.slice(0, -1);
        });
      }
    });
    props = {
      value,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store.setInputElement, props.ref),
      onPaste,
      onChange,
      onKeyDown
    };
    props = _WS3AS5PBcjs.useCompositeItem.call(void 0, { store, tabbable, ...props });
    return props;
  }
);
var TagInput = _743QABRAcjs.forwardRef.call(void 0, function TagInput2(props) {
  const htmlProps = useTagInput(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TagInput = TagInput; exports.useTagInput = useTagInput;
