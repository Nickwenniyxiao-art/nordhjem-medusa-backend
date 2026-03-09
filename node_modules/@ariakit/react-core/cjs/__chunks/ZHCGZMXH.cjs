"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FHB7634Ocjs = require('./FHB7634O.cjs');


var _UUGJI255cjs = require('./UUGJI255.cjs');





var _743QABRAcjs = require('./743QABRA.cjs');





var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/form/form-control.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "input";
function getNamedElement(ref, name) {
  const element = ref.current;
  if (!element) return null;
  if (element.name === name) return element;
  if (element.form) {
    return element.form.elements.namedItem(name);
  }
  const document = _dom.getDocument.call(void 0, element);
  return document.getElementsByName(name)[0];
}
function useItem(store, name, type) {
  return store.useState(
    (state) => state.items.find((item) => item.type === type && item.name === name)
  );
}
var useFormControl = _743QABRAcjs.createHook.call(void 0, 
  function useFormControl2({
    store,
    name: nameProp,
    getItem: getItemProp,
    touchOnBlur = true,
    ...props
  }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormControl must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const ref = _react.useRef.call(void 0, null);
    store.useValidate(async () => {
      const element = getNamedElement(ref, name);
      if (!element) return;
      await Promise.resolve();
      if ("validity" in element && !element.validity.valid) {
        store == null ? void 0 : store.setError(name, element.validationMessage);
      }
    });
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "field" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp]
    );
    const onBlurProp = props.onBlur;
    const touchOnBlurProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, touchOnBlur);
    const onBlur = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onBlurProp == null ? void 0 : onBlurProp(event);
      if (event.defaultPrevented) return;
      if (!touchOnBlurProp(event)) return;
      store == null ? void 0 : store.setFieldTouched(name, true);
    });
    const label = useItem(store, name, "label");
    const error = useItem(store, name, "error");
    const description = useItem(store, name, "description");
    const describedBy = _misc.cx.call(void 0, 
      error == null ? void 0 : error.id,
      description == null ? void 0 : description.id,
      props["aria-describedby"]
    );
    const invalid = store.useState(
      () => !!(store == null ? void 0 : store.getError(name)) && store.getFieldTouched(name)
    );
    props = {
      id,
      "aria-labelledby": label == null ? void 0 : label.id,
      "aria-invalid": invalid,
      ...props,
      "aria-describedby": describedBy || void 0,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onBlur
    };
    props = _UUGJI255cjs.useCollectionItem.call(void 0, { store, ...props, name, getItem });
    return props;
  }
);
var FormControl = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormControl2(props) {
    const htmlProps = useFormControl(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);




exports.useFormControl = useFormControl; exports.FormControl = FormControl;
