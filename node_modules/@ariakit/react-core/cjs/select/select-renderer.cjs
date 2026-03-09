"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _HJXE25KHcjs = require('../__chunks/HJXE25KH.cjs');



var _S62V5F35cjs = require('../__chunks/S62V5F35.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');



var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-renderer.tsx
var _array = require('@ariakit/core/utils/array');
var _react = require('react');
var TagName = "div";
function getItemObject(item) {
  if (!item || typeof item !== "object") {
    return { value: `${item}` };
  }
  return item;
}
function findIndicesByValue(items, value) {
  var _a;
  const values = _array.toArray.call(void 0, value);
  const indices = [];
  for (const [index, item] of items.entries()) {
    if (indices.length === values.length) break;
    const object = getItemObject(item);
    if (object.value != null && values.includes(object.value)) {
      indices.push(index);
    } else if ((_a = object.items) == null ? void 0 : _a.length) {
      const childIndices = findIndicesByValue(object.items, value);
      if (childIndices.length) {
        indices.push(index);
      }
    }
  }
  return indices;
}
function useSelectRenderer({
  store,
  orientation: orientationProp,
  persistentIndices: persistentIndicesProp,
  items: itemsProp,
  value: valueProp,
  ...props
}) {
  const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
  store = store || context;
  const items = _YY2UXBEBcjs.useStoreState.call(void 0, store, (state) => {
    if (!state) return itemsProp;
    if (!state.mounted) return 0;
    return itemsProp != null ? itemsProp : state.items;
  });
  const value = _YY2UXBEBcjs.useStoreState.call(void 0, store, (state) => valueProp != null ? valueProp : state == null ? void 0 : state.value);
  const valueIndices = _react.useMemo.call(void 0, () => {
    if (!items) return [];
    if (value == null) return [];
    if (typeof items === "number") return [];
    if (!items.length) return [];
    return findIndicesByValue(items, value);
  }, [items, value]);
  const persistentIndices = _react.useMemo.call(void 0, () => {
    if (persistentIndicesProp) {
      return [...persistentIndicesProp, ...valueIndices];
    }
    return valueIndices;
  }, [valueIndices, persistentIndicesProp]);
  return _HJXE25KHcjs.useCompositeRenderer.call(void 0, {
    store,
    items,
    persistentIndices,
    ...props
  });
}
var SelectRenderer = _743QABRAcjs.forwardRef.call(void 0, function SelectRenderer2(props) {
  const htmlProps = useSelectRenderer(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.SelectRenderer = SelectRenderer; exports.getSelectRendererItem = _S62V5F35cjs.getCollectionRendererItem; exports.getSelectRendererItemId = _S62V5F35cjs.getCollectionRendererItemId;
