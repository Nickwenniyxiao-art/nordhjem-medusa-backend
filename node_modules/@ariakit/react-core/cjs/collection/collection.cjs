"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _SS26HAQ2cjs = require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/collection/collection.tsx
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useCollection = _743QABRAcjs.createHook.call(void 0, 
  function useCollection2({ store, ...props }) {
    const context = _SS26HAQ2cjs.useCollectionProviderContext.call(void 0, );
    store = store || context;
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _SS26HAQ2cjs.CollectionScopedContextProvider, { value: store, children: element }),
      [store]
    );
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var Collection = _743QABRAcjs.forwardRef.call(void 0, function Collection2(props) {
  const htmlProps = useCollection(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.Collection = Collection; exports.useCollection = useCollection;
