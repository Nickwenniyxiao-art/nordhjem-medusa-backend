"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _SDXRA2A6cjs = require('./SDXRA2A6.cjs');



var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/form/form-store.ts
var _formstore = require('@ariakit/core/form/form-store'); var Core = _interopRequireWildcard(_formstore);
var _react = require('react');
function useFormStoreProps(store, update, props) {
  store = _SDXRA2A6cjs.useCollectionStoreProps.call(void 0, store, update, props);
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "values", "setValues");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "errors", "setErrors");
  _YY2UXBEBcjs.useStoreProps.call(void 0, store, props, "touched", "setTouched");
  const useValue = _react.useCallback.call(void 0, 
    (name) => store.useState(() => store.getValue(name)),
    [store]
  );
  const useValidate = _react.useCallback.call(void 0, 
    (callback) => {
      callback = _KGFTRA3Ccjs.useEvent.call(void 0, callback);
      const items = store.useState("items");
      _react.useEffect.call(void 0, () => store.onValidate(callback), [items, callback]);
    },
    [store]
  );
  const useSubmit = _react.useCallback.call(void 0, 
    (callback) => {
      callback = _KGFTRA3Ccjs.useEvent.call(void 0, callback);
      const items = store.useState("items");
      _react.useEffect.call(void 0, () => store.onSubmit(callback), [items, callback]);
    },
    [store]
  );
  return _react.useMemo.call(void 0, 
    () => ({
      ...store,
      useValue,
      useValidate,
      useSubmit
    }),
    []
  );
}
function useFormStore(props = {}) {
  const [store, update] = _YY2UXBEBcjs.useStore.call(void 0, Core.createFormStore, props);
  return useFormStoreProps(store, update, props);
}




exports.useFormStoreProps = useFormStoreProps; exports.useFormStore = useFormStore;
