"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');
require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag-values.tsx
var _misc = require('@ariakit/core/utils/misc');
function TagValues({ store, children } = {}) {
  const context = _THHAUPXTcjs.useTagContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "TagValues must receive a `store` prop or be wrapped in a TagProvider component."
  );
  const values = store.useState("values");
  if (children) {
    return children(values);
  }
  return values;
}


exports.TagValues = TagValues;
