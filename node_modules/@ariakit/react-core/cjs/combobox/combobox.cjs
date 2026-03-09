"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _YTQONGS5cjs = require('../__chunks/YTQONGS5.cjs');


var _YQMDNMVHcjs = require('../__chunks/YQMDNMVH.cjs');
require('../__chunks/MIBORXQW.cjs');


var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');









var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox.tsx





var _dom = require('@ariakit/core/utils/dom');



var _events = require('@ariakit/core/utils/events');
var _focus = require('@ariakit/core/utils/focus');





var _misc = require('@ariakit/core/utils/misc');
var _store = require('@ariakit/core/utils/store');
var _react = require('react');
var TagName = "input";
function isFirstItemAutoSelected(items, activeValue, autoSelect) {
  if (!autoSelect) return false;
  const firstItem = items.find((item) => !item.disabled && item.value);
  return (firstItem == null ? void 0 : firstItem.value) === activeValue;
}
function hasCompletionString(value, activeValue) {
  if (!activeValue) return false;
  if (value == null) return false;
  value = _misc.normalizeString.call(void 0, value);
  return activeValue.length > value.length && activeValue.toLowerCase().indexOf(value.toLowerCase()) === 0;
}
function isInputEvent(event) {
  return event.type === "input";
}
function isAriaAutoCompleteValue(value) {
  return value === "inline" || value === "list" || value === "both" || value === "none";
}
function getDefaultAutoSelectId(items) {
  const item = items.find((item2) => {
    var _a;
    if (item2.disabled) return false;
    return ((_a = item2.element) == null ? void 0 : _a.getAttribute("role")) !== "tab";
  });
  return item == null ? void 0 : item.id;
}
var useCombobox = _743QABRAcjs.createHook.call(void 0, 
  function useCombobox2({
    store,
    focusable = true,
    autoSelect: autoSelectProp = false,
    getAutoSelectId,
    setValueOnChange,
    showMinLength = 0,
    showOnChange,
    showOnMouseDown,
    showOnClick = showOnMouseDown,
    showOnKeyDown,
    showOnKeyPress = showOnKeyDown,
    blurActiveItemOnClick,
    setValueOnClick = true,
    moveOnKeyPress = true,
    autoComplete = "list",
    ...props
  }) {
    const context = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "Combobox must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const [valueUpdated, forceValueUpdate] = _KGFTRA3Ccjs.useForceUpdate.call(void 0, );
    const canAutoSelectRef = _react.useRef.call(void 0, false);
    const composingRef = _react.useRef.call(void 0, false);
    const autoSelect = store.useState(
      (state) => state.virtualFocus && autoSelectProp
    );
    const inline = autoComplete === "inline" || autoComplete === "both";
    const [canInline, setCanInline] = _react.useState.call(void 0, inline);
    _KGFTRA3Ccjs.useUpdateLayoutEffect.call(void 0, () => {
      if (!inline) return;
      setCanInline(true);
    }, [inline]);
    const storeValue = store.useState("value");
    const prevSelectedValueRef = _react.useRef.call(void 0, void 0);
    _react.useEffect.call(void 0, () => {
      return _store.sync.call(void 0, store, ["selectedValue", "activeId"], (_, prev) => {
        prevSelectedValueRef.current = prev.selectedValue;
      });
    }, []);
    const inlineActiveValue = store.useState((state) => {
      var _a;
      if (!inline) return;
      if (!canInline) return;
      if (state.activeValue && Array.isArray(state.selectedValue)) {
        if (state.selectedValue.includes(state.activeValue)) return;
        if ((_a = prevSelectedValueRef.current) == null ? void 0 : _a.includes(state.activeValue)) return;
      }
      return state.activeValue;
    });
    const items = store.useState("renderedItems");
    const open = store.useState("open");
    const contentElement = store.useState("contentElement");
    const value = _react.useMemo.call(void 0, () => {
      if (!inline) return storeValue;
      if (!canInline) return storeValue;
      const firstItemAutoSelected = isFirstItemAutoSelected(
        items,
        inlineActiveValue,
        autoSelect
      );
      if (firstItemAutoSelected) {
        if (hasCompletionString(storeValue, inlineActiveValue)) {
          const slice = (inlineActiveValue == null ? void 0 : inlineActiveValue.slice(storeValue.length)) || "";
          return storeValue + slice;
        }
        return storeValue;
      }
      return inlineActiveValue || storeValue;
    }, [inline, canInline, items, inlineActiveValue, autoSelect, storeValue]);
    _react.useEffect.call(void 0, () => {
      const element = ref.current;
      if (!element) return;
      const onCompositeItemMove = () => setCanInline(true);
      element.addEventListener("combobox-item-move", onCompositeItemMove);
      return () => {
        element.removeEventListener("combobox-item-move", onCompositeItemMove);
      };
    }, []);
    _react.useEffect.call(void 0, () => {
      if (!inline) return;
      if (!canInline) return;
      if (!inlineActiveValue) return;
      const firstItemAutoSelected = isFirstItemAutoSelected(
        items,
        inlineActiveValue,
        autoSelect
      );
      if (!firstItemAutoSelected) return;
      if (!hasCompletionString(storeValue, inlineActiveValue)) return;
      let cleanup = _misc.noop;
      queueMicrotask(() => {
        const element = ref.current;
        if (!element) return;
        const { start: prevStart, end: prevEnd } = _dom.getTextboxSelection.call(void 0, element);
        const nextStart = storeValue.length;
        const nextEnd = inlineActiveValue.length;
        _dom.setSelectionRange.call(void 0, element, nextStart, nextEnd);
        cleanup = () => {
          if (!_focus.hasFocus.call(void 0, element)) return;
          const { start, end } = _dom.getTextboxSelection.call(void 0, element);
          if (start !== nextStart) return;
          if (end !== nextEnd) return;
          _dom.setSelectionRange.call(void 0, element, prevStart, prevEnd);
        };
      });
      return () => cleanup();
    }, [
      valueUpdated,
      inline,
      canInline,
      inlineActiveValue,
      items,
      autoSelect,
      storeValue
    ]);
    const scrollingElementRef = _react.useRef.call(void 0, null);
    const getAutoSelectIdProp = _KGFTRA3Ccjs.useEvent.call(void 0, getAutoSelectId);
    const autoSelectIdRef = _react.useRef.call(void 0, null);
    _react.useEffect.call(void 0, () => {
      if (!open) return;
      if (!contentElement) return;
      const scrollingElement = _dom.getScrollingElement.call(void 0, contentElement);
      if (!scrollingElement) return;
      scrollingElementRef.current = scrollingElement;
      const onUserScroll = () => {
        canAutoSelectRef.current = false;
      };
      const onScroll = () => {
        if (!store) return;
        if (!canAutoSelectRef.current) return;
        const { activeId } = store.getState();
        if (activeId === null) return;
        if (activeId === autoSelectIdRef.current) return;
        canAutoSelectRef.current = false;
      };
      const options = { passive: true, capture: true };
      scrollingElement.addEventListener("wheel", onUserScroll, options);
      scrollingElement.addEventListener("touchmove", onUserScroll, options);
      scrollingElement.addEventListener("scroll", onScroll, options);
      return () => {
        scrollingElement.removeEventListener("wheel", onUserScroll, true);
        scrollingElement.removeEventListener("touchmove", onUserScroll, true);
        scrollingElement.removeEventListener("scroll", onScroll, true);
      };
    }, [open, contentElement, store]);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      if (!storeValue) return;
      if (composingRef.current) return;
      canAutoSelectRef.current = true;
    }, [storeValue]);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      if (autoSelect !== "always" && open) return;
      canAutoSelectRef.current = open;
    }, [autoSelect, open]);
    const resetValueOnSelect = store.useState("resetValueOnSelect");
    _KGFTRA3Ccjs.useUpdateEffect.call(void 0, () => {
      var _a, _b;
      const canAutoSelect = canAutoSelectRef.current;
      if (!store) return;
      if (!open) return;
      if (!canAutoSelect && !resetValueOnSelect) return;
      const { baseElement, contentElement: contentElement2, activeId } = store.getState();
      if (baseElement && !_focus.hasFocus.call(void 0, baseElement)) return;
      if (contentElement2 == null ? void 0 : contentElement2.hasAttribute("data-placing")) {
        const observer = new MutationObserver(forceValueUpdate);
        observer.observe(contentElement2, { attributeFilter: ["data-placing"] });
        return () => observer.disconnect();
      }
      if (autoSelect && canAutoSelect) {
        const userAutoSelectId = getAutoSelectIdProp(items);
        const autoSelectId = userAutoSelectId !== void 0 ? userAutoSelectId : (_a = getDefaultAutoSelectId(items)) != null ? _a : store.first();
        autoSelectIdRef.current = autoSelectId;
        store.move(autoSelectId != null ? autoSelectId : null);
      } else {
        const element = (_b = store.item(activeId || store.first())) == null ? void 0 : _b.element;
        if (element && "scrollIntoView" in element) {
          element.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      }
      return;
    }, [
      store,
      open,
      valueUpdated,
      storeValue,
      autoSelect,
      resetValueOnSelect,
      getAutoSelectIdProp,
      items
    ]);
    _react.useEffect.call(void 0, () => {
      if (!inline) return;
      const combobox = ref.current;
      if (!combobox) return;
      const elements = [combobox, contentElement].filter(
        (value2) => !!value2
      );
      const onBlur2 = (event) => {
        if (elements.every((el) => _events.isFocusEventOutside.call(void 0, event, el))) {
          store == null ? void 0 : store.setValue(value);
        }
      };
      for (const element of elements) {
        element.addEventListener("focusout", onBlur2);
      }
      return () => {
        for (const element of elements) {
          element.removeEventListener("focusout", onBlur2);
        }
      };
    }, [inline, contentElement, store, value]);
    const canShow = (event) => {
      const currentTarget = event.currentTarget;
      return currentTarget.value.length >= showMinLength;
    };
    const onChangeProp = props.onChange;
    const showOnChangeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, showOnChange != null ? showOnChange : canShow);
    const setValueOnChangeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, 
      // If the combobox is combined with tags, the value will be set by the tag
      // input component.
      setValueOnChange != null ? setValueOnChange : !store.tag
    );
    const onChange = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      if (!store) return;
      const currentTarget = event.currentTarget;
      const { value: value2, selectionStart, selectionEnd } = currentTarget;
      const nativeEvent = event.nativeEvent;
      canAutoSelectRef.current = true;
      if (isInputEvent(nativeEvent)) {
        if (nativeEvent.isComposing) {
          canAutoSelectRef.current = false;
          composingRef.current = true;
        }
        if (inline) {
          const textInserted = nativeEvent.inputType === "insertText" || nativeEvent.inputType === "insertCompositionText";
          const caretAtEnd = selectionStart === value2.length;
          setCanInline(textInserted && caretAtEnd);
        }
      }
      if (setValueOnChangeProp(event)) {
        const isSameValue = value2 === store.getState().value;
        store.setValue(value2);
        queueMicrotask(() => {
          _dom.setSelectionRange.call(void 0, currentTarget, selectionStart, selectionEnd);
        });
        if (inline && autoSelect && isSameValue) {
          forceValueUpdate();
        }
      }
      if (showOnChangeProp(event)) {
        store.show();
      }
      if (!autoSelect || !canAutoSelectRef.current) {
        store.setActiveId(null);
      }
    });
    const onCompositionEndProp = props.onCompositionEnd;
    const onCompositionEnd = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      canAutoSelectRef.current = true;
      composingRef.current = false;
      onCompositionEndProp == null ? void 0 : onCompositionEndProp(event);
      if (event.defaultPrevented) return;
      if (!autoSelect) return;
      forceValueUpdate();
    });
    const onMouseDownProp = props.onMouseDown;
    const blurActiveItemOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, 
      blurActiveItemOnClick != null ? blurActiveItemOnClick : (() => !!(store == null ? void 0 : store.getState().includesBaseElement))
    );
    const setValueOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, setValueOnClick);
    const showOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, showOnClick != null ? showOnClick : canShow);
    const onMouseDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onMouseDownProp == null ? void 0 : onMouseDownProp(event);
      if (event.defaultPrevented) return;
      if (event.button) return;
      if (event.ctrlKey) return;
      if (!store) return;
      if (blurActiveItemOnClickProp(event)) {
        store.setActiveId(null);
      }
      if (setValueOnClickProp(event)) {
        store.setValue(value);
      }
      if (showOnClickProp(event)) {
        _events.queueBeforeEvent.call(void 0, event.currentTarget, "mouseup", store.show);
      }
    });
    const onKeyDownProp = props.onKeyDown;
    const showOnKeyPressProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, showOnKeyPress != null ? showOnKeyPress : canShow);
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (!event.repeat) {
        canAutoSelectRef.current = false;
      }
      if (event.defaultPrevented) return;
      if (event.ctrlKey) return;
      if (event.altKey) return;
      if (event.shiftKey) return;
      if (event.metaKey) return;
      if (!store) return;
      const { open: open2 } = store.getState();
      if (open2) return;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (showOnKeyPressProp(event)) {
          event.preventDefault();
          store.show();
        }
      }
    });
    const onBlurProp = props.onBlur;
    const onBlur = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      canAutoSelectRef.current = false;
      onBlurProp == null ? void 0 : onBlurProp(event);
      if (event.defaultPrevented) return;
    });
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const ariaAutoComplete = isAriaAutoCompleteValue(autoComplete) ? autoComplete : void 0;
    const isActiveItem = store.useState((state) => state.activeId === null);
    props = {
      id,
      role: "combobox",
      "aria-autocomplete": ariaAutoComplete,
      "aria-haspopup": _dom.getPopupRole.call(void 0, contentElement, "listbox"),
      "aria-expanded": open,
      "aria-controls": contentElement == null ? void 0 : contentElement.id,
      "data-active-item": isActiveItem || void 0,
      value,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onChange,
      onCompositionEnd,
      onMouseDown,
      onKeyDown,
      onBlur
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, {
      store,
      focusable,
      ...props,
      // Enable inline autocomplete when the user moves from the combobox input
      // to an item.
      moveOnKeyPress: (event) => {
        if (_misc.isFalsyBooleanCallback.call(void 0, moveOnKeyPress, event)) return false;
        if (inline) setCanInline(true);
        return true;
      }
    });
    props = _YQMDNMVHcjs.usePopoverAnchor.call(void 0, { store, ...props });
    return { autoComplete: "off", ...props };
  }
);
var Combobox = _743QABRAcjs.forwardRef.call(void 0, function Combobox2(props) {
  const htmlProps = useCombobox(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.Combobox = Combobox; exports.useCombobox = useCombobox;
