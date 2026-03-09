"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _3ZDSDKC6cjs = require('./3ZDSDKC6.cjs');





var _MLRWKUIEcjs = require('./MLRWKUIE.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');






var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/combobox/combobox-list.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useComboboxList = _743QABRAcjs.createHook.call(void 0, 
  function useComboboxList2({ store, alwaysVisible, ...props }) {
    const scopedContext = _MLRWKUIEcjs.useComboboxScopedContext.call(void 0, true);
    const context = _MLRWKUIEcjs.useComboboxContext.call(void 0, );
    store = store || context;
    const scopedContextSameStore = !!store && store === scopedContext;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "ComboboxList must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const mounted = store.useState("mounted");
    const hidden = _3ZDSDKC6cjs.isHidden.call(void 0, mounted, props.hidden, alwaysVisible);
    const style = hidden ? { ...props.style, display: "none" } : props.style;
    const multiSelectable = store.useState(
      (state) => Array.isArray(state.selectedValue)
    );
    const role = _KGFTRA3Ccjs.useAttribute.call(void 0, ref, "role", props.role);
    const isCompositeRole = role === "listbox" || role === "tree" || role === "grid";
    const ariaMultiSelectable = isCompositeRole ? multiSelectable || void 0 : void 0;
    const [hasListboxInside, setHasListboxInside] = _react.useState.call(void 0, false);
    const contentElement = store.useState("contentElement");
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      if (!mounted) return;
      const element = ref.current;
      if (!element) return;
      if (contentElement !== element) return;
      const callback = () => {
        setHasListboxInside(!!element.querySelector("[role='listbox']"));
      };
      const observer = new MutationObserver(callback);
      observer.observe(element, {
        subtree: true,
        childList: true,
        attributeFilter: ["role"]
      });
      callback();
      return () => observer.disconnect();
    }, [mounted, contentElement]);
    if (!hasListboxInside) {
      props = {
        role: "listbox",
        "aria-multiselectable": ariaMultiSelectable,
        ...props
      };
    }
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MLRWKUIEcjs.ComboboxScopedContextProvider, { value: store, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _MLRWKUIEcjs.ComboboxListRoleContext.Provider, { value: role, children: element }) }),
      [store, role]
    );
    const setContentElement = id && (!scopedContext || !scopedContextSameStore) ? store.setContentElement : null;
    props = {
      id,
      hidden,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, setContentElement, ref, props.ref),
      style
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var ComboboxList = _743QABRAcjs.forwardRef.call(void 0, function ComboboxList2(props) {
  const htmlProps = useComboboxList(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useComboboxList = useComboboxList; exports.ComboboxList = ComboboxList;
