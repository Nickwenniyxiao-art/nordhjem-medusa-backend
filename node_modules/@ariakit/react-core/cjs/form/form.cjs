"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');







var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "form";
function isField(element, items) {
  return items.some(
    (item) => item.type === "field" && item.element === element
  );
}
function getFirstInvalidField(items) {
  return items.find(
    (item) => {
      var _a;
      return item.type === "field" && ((_a = item.element) == null ? void 0 : _a.getAttribute("aria-invalid")) === "true";
    }
  );
}
var useForm = _743QABRAcjs.createHook.call(void 0, function useForm2({
  store,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnUnmount = false,
  resetOnSubmit = true,
  autoFocusOnSubmit = true,
  ...props
}) {
  const context = _FHB7634Ocjs.useFormContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "Form must receive a `store` prop or be wrapped in a FormProvider component."
  );
  const ref = _react.useRef.call(void 0, null);
  const values = store.useState("values");
  const submitSucceed = store.useState("submitSucceed");
  const submitFailed = store.useState("submitFailed");
  const items = store.useState("items");
  const defaultValues = _KGFTRA3Ccjs.useInitialValue.call(void 0, values);
  _react.useEffect.call(void 0, 
    () => resetOnUnmount ? store == null ? void 0 : store.reset : void 0,
    [resetOnUnmount, store]
  );
  _KGFTRA3Ccjs.useUpdateEffect.call(void 0, () => {
    if (!validateOnChange) return;
    if (values === defaultValues) return;
    store == null ? void 0 : store.validate();
  }, [validateOnChange, values, defaultValues, store]);
  _react.useEffect.call(void 0, () => {
    if (!resetOnSubmit) return;
    if (!submitSucceed) return;
    store == null ? void 0 : store.reset();
  }, [resetOnSubmit, submitSucceed, store]);
  const [shouldFocusOnSubmit, setShouldFocusOnSubmit] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (!shouldFocusOnSubmit) return;
    if (!submitFailed) return;
    const field = getFirstInvalidField(items);
    const element = field == null ? void 0 : field.element;
    if (!element) return;
    setShouldFocusOnSubmit(false);
    element.focus();
    if (_dom.isTextField.call(void 0, element)) {
      element.select();
    }
  }, [autoFocusOnSubmit, submitFailed, items]);
  const onSubmitProp = props.onSubmit;
  const onSubmit = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onSubmitProp == null ? void 0 : onSubmitProp(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    store == null ? void 0 : store.submit();
    if (!autoFocusOnSubmit) return;
    setShouldFocusOnSubmit(true);
  });
  const onBlurProp = props.onBlur;
  const onBlur = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onBlurProp == null ? void 0 : onBlurProp(event);
    if (event.defaultPrevented) return;
    if (!validateOnBlur) return;
    if (!store) return;
    if (!isField(event.target, store.getState().items)) return;
    store.validate();
  });
  const onResetProp = props.onReset;
  const onReset = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onResetProp == null ? void 0 : onResetProp(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    store == null ? void 0 : store.reset();
  });
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _FHB7634Ocjs.FormScopedContextProvider, { value: store, children: element }),
    [store]
  );
  const tagName = _KGFTRA3Ccjs.useTagName.call(void 0, ref, TagName);
  props = {
    role: tagName !== "form" ? "form" : void 0,
    noValidate: true,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
    onSubmit,
    onBlur,
    onReset
  };
  return props;
});
var Form = _743QABRAcjs.forwardRef.call(void 0, function Form2(props) {
  const htmlProps = useForm(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.Form = Form; exports.useForm = useForm;
