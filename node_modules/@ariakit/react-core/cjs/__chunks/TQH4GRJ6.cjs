"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _4NZHMZNFcjs = require('./4NZHMZNF.cjs');


var _ALTUQCI3cjs = require('./ALTUQCI3.cjs');


var _WS3AS5PBcjs = require('./WS3AS5PB.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');





var _743QABRAcjs = require('./743QABRA.cjs');





var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/select/select-item.tsx
var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function isSelected(storeValue, itemValue) {
  if (itemValue == null) return;
  if (storeValue == null) return false;
  if (Array.isArray(storeValue)) {
    return storeValue.includes(itemValue);
  }
  return storeValue === itemValue;
}
var useSelectItem = _743QABRAcjs.createHook.call(void 0, 
  function useSelectItem2({
    store,
    value,
    getItem: getItemProp,
    hideOnClick,
    setValueOnClick = value != null,
    preventScrollOnKeyDown = true,
    focusOnHover = true,
    ...props
  }) {
    var _a;
    const context = _4NZHMZNFcjs.useSelectScopedContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "SelectItem must be wrapped in a SelectList or SelectPopover component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const disabled = _misc.disabledFromProps.call(void 0, props);
    const { listElement, multiSelectable, selected, autoFocus } = _YY2UXBEBcjs.useStoreStateObject.call(void 0, store, {
      listElement: "listElement",
      multiSelectable(state) {
        return Array.isArray(state.value);
      },
      selected(state) {
        return isSelected(state.value, value);
      },
      autoFocus(state) {
        if (value == null) return false;
        if (state.value == null) return false;
        if (state.activeId !== id && (store == null ? void 0 : store.item(state.activeId))) {
          return false;
        }
        if (Array.isArray(state.value)) {
          return state.value[state.value.length - 1] === value;
        }
        return state.value === value;
      }
    });
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = {
          ...item,
          value: disabled ? void 0 : value,
          children: value
        };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [disabled, value, getItemProp]
    );
    hideOnClick = hideOnClick != null ? hideOnClick : value != null && !multiSelectable;
    const onClickProp = props.onClick;
    const setValueOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, setValueOnClick);
    const hideOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, hideOnClick);
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (_events.isDownloading.call(void 0, event)) return;
      if (_events.isOpeningInNewTab.call(void 0, event)) return;
      if (setValueOnClickProp(event) && value != null) {
        store == null ? void 0 : store.setValue((prevValue) => {
          if (!Array.isArray(prevValue)) return value;
          if (prevValue.includes(value)) {
            return prevValue.filter((v) => v !== value);
          }
          return [...prevValue, value];
        });
      }
      if (hideOnClickProp(event)) {
        store == null ? void 0 : store.hide();
      }
    });
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _4NZHMZNFcjs.SelectItemCheckedContext.Provider, { value: selected != null ? selected : false, children: element }),
      [selected]
    );
    props = {
      id,
      role: _dom.getPopupItemRole.call(void 0, listElement),
      "aria-selected": selected,
      children: value,
      ...props,
      autoFocus: (_a = props.autoFocus) != null ? _a : autoFocus,
      onClick
    };
    props = _WS3AS5PBcjs.useCompositeItem.call(void 0, {
      store,
      getItem,
      preventScrollOnKeyDown,
      ...props
    });
    const focusOnHoverProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, focusOnHover);
    props = _ALTUQCI3cjs.useCompositeHover.call(void 0, {
      store,
      ...props,
      // We have to disable focusOnHover when the popup is closed, otherwise
      // the active item will change to null (the container) when the popup is
      // closed by clicking on an item.
      focusOnHover(event) {
        if (!focusOnHoverProp(event)) return false;
        const state = store == null ? void 0 : store.getState();
        return !!(state == null ? void 0 : state.open);
      }
    });
    return props;
  }
);
var SelectItem = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function SelectItem2(props) {
    const htmlProps = useSelectItem(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);




exports.useSelectItem = useSelectItem; exports.SelectItem = SelectItem;
