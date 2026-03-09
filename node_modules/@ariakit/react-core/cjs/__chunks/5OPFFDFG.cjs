"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _77IUZSUBcjs = require('./77IUZSUB.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');

// src/tooltip/tooltip-store.ts
var _tooltipstore = require('@ariakit/core/tooltip/tooltip-store'); var Core = _interopRequireWildcard(_tooltipstore);
function useTooltipStoreProps(store, update, props) {
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "type");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "skipTimeout");
  return _77IUZSUBcjs.useHovercardStoreProps.call(void 0, store, update, props);
}
function useTooltipStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createTooltipStore, props);
  return useTooltipStoreProps(store, update, props);
}




exports.useTooltipStoreProps = useTooltipStoreProps; exports.useTooltipStore = useTooltipStore;
