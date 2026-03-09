"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _DIH46ZNHcjs = require('../__chunks/DIH46ZNH.cjs');




var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');


var _WS3AS5PBcjs = require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');





var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag.tsx
var _misc = require('@ariakit/core/utils/misc');
var _platform = require('@ariakit/core/utils/platform');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useTag = _743QABRAcjs.createHook.call(void 0, function useTag2({
  store,
  value,
  getItem: getItemProp,
  removeOnKeyPress = true,
  ...props
}) {
  const context = _THHAUPXTcjs.useTagContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "Tag must be wrapped in a TagList component."
  );
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  const touchDevice = _DIH46ZNHcjs.useTouchDevice.call(void 0, );
  const getItem = _react.useCallback.call(void 0, 
    (item) => {
      const nextItem = { ...item, value };
      if (getItemProp) {
        return getItemProp(nextItem);
      }
      return nextItem;
    },
    [value, getItemProp]
  );
  const onKeyDownProp = props.onKeyDown;
  const removeOnKeyPressProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, removeOnKeyPress);
  const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onKeyDownProp == null ? void 0 : onKeyDownProp(event);
    if (event.defaultPrevented) return;
    const { inputElement } = store.getState();
    const isBackspace = event.key === "Backspace";
    const isRemoveKey = isBackspace || event.key === "Delete";
    if (isRemoveKey && removeOnKeyPressProp(event)) {
      event.preventDefault();
      store.removeValue(value);
      const nextId = isBackspace ? store.previous() || store.next() : store.next();
      store.move(nextId);
    }
    const isPrintableKey = !event.ctrlKey && !event.metaKey && event.key.length === 1;
    const pc = !_platform.isApple.call(void 0, );
    const v = event.key === "v" || event.key === "V";
    const mod = pc ? event.ctrlKey : event.metaKey;
    const isPaste = mod && v;
    if (isPrintableKey || isPaste) {
      inputElement == null ? void 0 : inputElement.focus();
    }
  });
  const [removeId, setRemoveId] = _react.useState.call(void 0, );
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _THHAUPXTcjs.TagValueContext.Provider, { value, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _THHAUPXTcjs.TagRemoveIdContext.Provider, { value: setRemoveId, children: element }) }),
    [value]
  );
  props = {
    id,
    role: !touchDevice ? "option" : "listitem",
    children: value,
    "aria-describedby": removeId,
    ...props,
    onKeyDown
  };
  props = _WS3AS5PBcjs.useCompositeItem.call(void 0, {
    store,
    ...props,
    getItem
  });
  return props;
});
var Tag = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Tag2(props) {
    const htmlProps = useTag(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.Tag = Tag; exports.useTag = useTag;
