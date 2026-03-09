"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _567HKB5Ncjs = require('./567HKB5N.cjs');


var _WS3AS5PBcjs = require('./WS3AS5PB.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');





var _743QABRAcjs = require('./743QABRA.cjs');






var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/radio/radio.tsx



var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "input";
function getIsChecked(value, storeValue) {
  if (storeValue === void 0) return;
  if (value != null && storeValue != null) {
    return storeValue === value;
  }
  return !!storeValue;
}
function isNativeRadio(tagName, type) {
  return tagName === "input" && (!type || type === "radio");
}
var useRadio = _743QABRAcjs.createHook.call(void 0, function useRadio2({
  store,
  name,
  value,
  checked,
  ...props
}) {
  const context = _567HKB5Ncjs.useRadioContext.call(void 0, );
  store = store || context;
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  const ref = _react.useRef.call(void 0, null);
  const isChecked = _YY2UXBEBcjs.useStoreState.call(void 0, 
    store,
    (state) => checked != null ? checked : getIsChecked(value, state == null ? void 0 : state.value)
  );
  _react.useEffect.call(void 0, () => {
    if (!id) return;
    if (!isChecked) return;
    const isActiveItem = (store == null ? void 0 : store.getState().activeId) === id;
    if (isActiveItem) return;
    store == null ? void 0 : store.setActiveId(id);
  }, [store, isChecked, id]);
  const onChangeProp = props.onChange;
  const tagName = _KGFTRA3Ccjs.useTagName.call(void 0, ref, TagName);
  const nativeRadio = isNativeRadio(tagName, props.type);
  const disabled = _misc.disabledFromProps.call(void 0, props);
  const [propertyUpdated, schedulePropertyUpdate] = _KGFTRA3Ccjs.useForceUpdate.call(void 0, );
  _react.useEffect.call(void 0, () => {
    const element = ref.current;
    if (!element) return;
    if (nativeRadio) return;
    if (isChecked !== void 0) {
      element.checked = isChecked;
    }
    if (name !== void 0) {
      element.name = name;
    }
    if (value !== void 0) {
      element.value = `${value}`;
    }
  }, [propertyUpdated, nativeRadio, isChecked, name, value]);
  const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if ((store == null ? void 0 : store.getState().value) === value) return;
    if (!nativeRadio) {
      event.currentTarget.checked = true;
      schedulePropertyUpdate();
    }
    onChangeProp == null ? void 0 : onChangeProp(event);
    if (event.defaultPrevented) return;
    store == null ? void 0 : store.setValue(value);
  });
  const onClickProp = props.onClick;
  const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    if (nativeRadio) return;
    onChange(event);
  });
  const onFocusProp = props.onFocus;
  const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    if (!nativeRadio) return;
    if (!store) return;
    const { moves, activeId } = store.getState();
    if (!moves) return;
    if (id && activeId !== id) return;
    onChange(event);
  });
  props = {
    id,
    role: !nativeRadio ? "radio" : void 0,
    type: nativeRadio ? "radio" : void 0,
    "aria-checked": isChecked,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
    onChange,
    onClick,
    onFocus
  };
  props = _WS3AS5PBcjs.useCompositeItem.call(void 0, {
    store,
    clickOnEnter: !nativeRadio,
    ...props
  });
  return _misc.removeUndefinedValues.call(void 0, {
    name: nativeRadio ? name : void 0,
    value: nativeRadio ? value : void 0,
    checked: isChecked,
    ...props
  });
});
var Radio = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Radio2(props) {
    const htmlProps = useRadio(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);




exports.useRadio = useRadio; exports.Radio = Radio;
