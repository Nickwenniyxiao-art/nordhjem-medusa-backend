"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _CFNQ2EAVcjs = require('./CFNQ2EAV.cjs');


var _IRJEBRAWcjs = require('./IRJEBRAW.cjs');


var _HNUUQ6LRcjs = require('./HNUUQ6LR.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');






var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/checkbox/checkbox.tsx



var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "input";
function setMixed(element, mixed) {
  if (mixed) {
    element.indeterminate = true;
  } else if (element.indeterminate) {
    element.indeterminate = false;
  }
}
function isNativeCheckbox(tagName, type) {
  return tagName === "input" && (!type || type === "checkbox");
}
function getPrimitiveValue(value) {
  if (Array.isArray(value)) {
    return value.toString();
  }
  return value;
}
var useCheckbox = _743QABRAcjs.createHook.call(void 0, 
  function useCheckbox2({
    store,
    name,
    value: valueProp,
    checked: checkedProp,
    defaultChecked,
    ...props
  }) {
    const context = _HNUUQ6LRcjs.useCheckboxContext.call(void 0, );
    store = store || context;
    const [_checked, setChecked] = _react.useState.call(void 0, defaultChecked != null ? defaultChecked : false);
    const checked = _YY2UXBEBcjs.useStoreState.call(void 0, store, (state) => {
      if (checkedProp !== void 0) return checkedProp;
      if ((state == null ? void 0 : state.value) === void 0) return _checked;
      if (valueProp != null) {
        if (Array.isArray(state.value)) {
          const primitiveValue = getPrimitiveValue(valueProp);
          return state.value.includes(primitiveValue);
        }
        return state.value === valueProp;
      }
      if (Array.isArray(state.value)) return false;
      if (typeof state.value === "boolean") return state.value;
      return false;
    });
    const ref = _react.useRef.call(void 0, null);
    const tagName = _KGFTRA3Ccjs.useTagName.call(void 0, ref, TagName);
    const nativeCheckbox = isNativeCheckbox(tagName, props.type);
    const mixed = checked ? checked === "mixed" : void 0;
    const isChecked = checked === "mixed" ? false : checked;
    const disabled = _misc.disabledFromProps.call(void 0, props);
    const [propertyUpdated, schedulePropertyUpdate] = _KGFTRA3Ccjs.useForceUpdate.call(void 0, );
    _react.useEffect.call(void 0, () => {
      const element = ref.current;
      if (!element) return;
      setMixed(element, mixed);
      if (nativeCheckbox) return;
      element.checked = isChecked;
      if (name !== void 0) {
        element.name = name;
      }
      if (valueProp !== void 0) {
        element.value = `${valueProp}`;
      }
    }, [propertyUpdated, mixed, nativeCheckbox, isChecked, name, valueProp]);
    const onChangeProp = props.onChange;
    const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      if (disabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      setMixed(event.currentTarget, mixed);
      if (!nativeCheckbox) {
        event.currentTarget.checked = !event.currentTarget.checked;
        schedulePropertyUpdate();
      }
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      const elementChecked = event.currentTarget.checked;
      setChecked(elementChecked);
      store == null ? void 0 : store.setValue((prevValue) => {
        if (valueProp == null) return elementChecked;
        const primitiveValue = getPrimitiveValue(valueProp);
        if (!Array.isArray(prevValue)) {
          return prevValue === primitiveValue ? false : primitiveValue;
        }
        if (elementChecked) {
          if (prevValue.includes(primitiveValue)) {
            return prevValue;
          }
          return [...prevValue, primitiveValue];
        }
        return prevValue.filter((v) => v !== primitiveValue);
      });
    });
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (nativeCheckbox) return;
      onChange(event);
    });
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _IRJEBRAWcjs.CheckboxCheckedContext.Provider, { value: isChecked, children: element }),
      [isChecked]
    );
    props = {
      role: !nativeCheckbox ? "checkbox" : void 0,
      type: nativeCheckbox ? "checkbox" : void 0,
      "aria-checked": checked,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onChange,
      onClick
    };
    props = _CFNQ2EAVcjs.useCommand.call(void 0, { clickOnEnter: !nativeCheckbox, ...props });
    return _misc.removeUndefinedValues.call(void 0, {
      name: nativeCheckbox ? name : void 0,
      value: nativeCheckbox ? valueProp : void 0,
      checked: isChecked,
      ...props
    });
  }
);
var Checkbox = _743QABRAcjs.forwardRef.call(void 0, function Checkbox2(props) {
  const htmlProps = useCheckbox(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useCheckbox = useCheckbox; exports.Checkbox = Checkbox;
