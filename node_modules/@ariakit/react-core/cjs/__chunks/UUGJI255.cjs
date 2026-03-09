"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _SS26HAQ2cjs = require('./SS26HAQ2.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');



var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/collection/collection-item.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
var useCollectionItem = _743QABRAcjs.createHook.call(void 0, 
  function useCollectionItem2({
    store,
    shouldRegisterItem = true,
    getItem = _misc.identity,
    // @ts-expect-error This prop may come from a collection renderer.
    element,
    ...props
  }) {
    const context = _SS26HAQ2cjs.useCollectionContext.call(void 0, );
    store = store || context;
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const ref = _react.useRef.call(void 0, element);
    _react.useEffect.call(void 0, () => {
      const element2 = ref.current;
      if (!id) return;
      if (!element2) return;
      if (!shouldRegisterItem) return;
      const item = getItem({ id, element: element2 });
      return store == null ? void 0 : store.renderItem(item);
    }, [id, shouldRegisterItem, getItem, store]);
    props = {
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var CollectionItem = _743QABRAcjs.forwardRef.call(void 0, function CollectionItem2(props) {
  const htmlProps = useCollectionItem(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCollectionItem = useCollectionItem; exports.CollectionItem = CollectionItem;
