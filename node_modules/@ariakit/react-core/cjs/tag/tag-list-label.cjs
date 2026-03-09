"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag-list-label.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "label";
var useTagListLabel = _743QABRAcjs.createHook.call(void 0, 
  function useTagListLabel2({ store, ...props }) {
    const context = _THHAUPXTcjs.useTagContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TagListLabel must receive a `store` prop or be wrapped in a TagProvider component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const htmlFor = store.useState((state) => {
      var _a;
      return (_a = state.inputElement) == null ? void 0 : _a.id;
    });
    props = {
      id,
      htmlFor,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store.setLabelElement, props.ref)
    };
    return props;
  }
);
var TagListLabel = _743QABRAcjs.forwardRef.call(void 0, function TagListLabel2(props) {
  const htmlProps = useTagListLabel(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TagListLabel = TagListLabel; exports.useTagListLabel = useTagListLabel;
