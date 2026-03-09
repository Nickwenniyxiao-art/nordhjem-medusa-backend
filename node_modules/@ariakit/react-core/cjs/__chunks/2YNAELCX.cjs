"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _4NZHMZNFcjs = require('./4NZHMZNF.cjs');


var _7WQJLR5Ucjs = require('./7WQJLR5U.cjs');


var _3ZDSDKC6cjs = require('./3ZDSDKC6.cjs');


var _YTQONGS5cjs = require('./YTQONGS5.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');








var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/select/select-list.tsx
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var SelectListContext = _react.createContext.call(void 0, null);
var useSelectList = _743QABRAcjs.createHook.call(void 0, 
  function useSelectList2({
    store,
    resetOnEscape = true,
    hideOnEnter = true,
    focusOnMove = true,
    composite,
    alwaysVisible,
    ...props
  }) {
    const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "SelectList must receive a `store` prop or be wrapped in a SelectProvider component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const value = store.useState("value");
    const multiSelectable = Array.isArray(value);
    const [defaultValue, setDefaultValue] = _react.useState.call(void 0, value);
    const mounted = store.useState("mounted");
    _react.useEffect.call(void 0, () => {
      if (mounted) return;
      setDefaultValue(value);
    }, [mounted, value]);
    resetOnEscape = resetOnEscape && !multiSelectable;
    const onKeyDownProp = props.onKeyDown;
    const resetOnEscapeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, resetOnEscape);
    const hideOnEnterProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, hideOnEnter);
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      if (event.key === "Escape" && resetOnEscapeProp(event)) {
        store == null ? void 0 : store.setValue(defaultValue);
      }
      if (event.key === " " || event.key === "Enter") {
        if (_events.isSelfTarget.call(void 0, event) && hideOnEnterProp(event)) {
          event.preventDefault();
          store == null ? void 0 : store.hide();
        }
      }
    });
    const headingContext = _react.useContext.call(void 0, _4NZHMZNFcjs.SelectHeadingContext);
    const headingState = _react.useState.call(void 0, );
    const [headingId, setHeadingId] = headingContext || headingState;
    const headingContextValue = _react.useMemo.call(void 0, 
      () => [headingId, setHeadingId],
      [headingId]
    );
    const [childStore, setChildStore] = _react.useState.call(void 0, null);
    const setStore = _react.useContext.call(void 0, SelectListContext);
    _react.useEffect.call(void 0, () => {
      if (!setStore) return;
      setStore(store);
      return () => setStore(null);
    }, [setStore, store]);
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element2) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _4NZHMZNFcjs.SelectScopedContextProvider, { value: store, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SelectListContext.Provider, { value: setChildStore, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _4NZHMZNFcjs.SelectHeadingContext.Provider, { value: headingContextValue, children: element2 }) }) }),
      [store, headingContextValue]
    );
    const hasCombobox = !!store.combobox;
    composite = composite != null ? composite : !hasCombobox && childStore !== store;
    const [element, setElement] = _KGFTRA3Ccjs.useTransactionState.call(void 0, 
      composite ? store.setListElement : null
    );
    const role = _KGFTRA3Ccjs.useAttribute.call(void 0, element, "role", props.role);
    const isCompositeRole = role === "listbox" || role === "menu" || role === "tree" || role === "grid";
    const ariaMultiSelectable = composite || isCompositeRole ? multiSelectable || void 0 : void 0;
    const hidden = _3ZDSDKC6cjs.isHidden.call(void 0, mounted, props.hidden, alwaysVisible);
    const style = hidden ? { ...props.style, display: "none" } : props.style;
    if (composite) {
      props = {
        role: "listbox",
        "aria-multiselectable": ariaMultiSelectable,
        ...props
      };
    }
    const labelId = store.useState(
      (state) => {
        var _a;
        return headingId || ((_a = state.labelElement) == null ? void 0 : _a.id);
      }
    );
    props = {
      id,
      "aria-labelledby": labelId,
      hidden,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, setElement, props.ref),
      style,
      onKeyDown
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, ...props, composite });
    props = _7WQJLR5Ucjs.useCompositeTypeahead.call(void 0, { store, typeahead: !hasCombobox, ...props });
    return props;
  }
);
var SelectList = _743QABRAcjs.forwardRef.call(void 0, function SelectList2(props) {
  const htmlProps = useSelectList(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useSelectList = useSelectList; exports.SelectList = SelectList;
