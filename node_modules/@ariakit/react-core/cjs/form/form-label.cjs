"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');


var _UUGJI255cjs = require('../__chunks/UUGJI255.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');





var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-label.tsx
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "label";
function supportsNativeLabel(tagName) {
  return tagName === "input" || tagName === "textarea" || tagName === "select" || tagName === "meter" || tagName === "progress";
}
var useFormLabel = _743QABRAcjs.createHook.call(void 0, 
  function useFormLabel2({
    store,
    name: nameProp,
    getItem: getItemProp,
    ...props
  }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormLabel must be wrapped in a Form component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const ref = _react.useRef.call(void 0, null);
    const name = `${nameProp}`;
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "label" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp]
    );
    const field = store.useState(
      (state) => state.items.find((item) => item.type === "field" && item.name === name)
    );
    const fieldTagName = _KGFTRA3Ccjs.useTagName.call(void 0, field == null ? void 0 : field.element, "input");
    const isNativeLabel = supportsNativeLabel(fieldTagName);
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (isNativeLabel) return;
      const fieldElement = field == null ? void 0 : field.element;
      if (!fieldElement) return;
      queueMicrotask(() => {
        const focusableElement = _focus.getFirstTabbableIn.call(void 0, fieldElement, true, true);
        focusableElement == null ? void 0 : focusableElement.focus();
        const role = focusableElement == null ? void 0 : focusableElement.getAttribute("role");
        if (role === "combobox") return;
        focusableElement == null ? void 0 : focusableElement.click();
      });
    });
    props = {
      id,
      render: isNativeLabel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "label", {}) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {}),
      htmlFor: isNativeLabel ? field == null ? void 0 : field.id : void 0,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onClick
    };
    if (!isNativeLabel) {
      props = {
        ...props,
        style: {
          cursor: "default",
          ...props.style
        }
      };
    }
    props = _UUGJI255cjs.useCollectionItem.call(void 0, { store, ...props, getItem });
    return props;
  }
);
var FormLabel = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function FormLabel2(props) {
    const htmlProps = useFormLabel(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.FormLabel = FormLabel; exports.useFormLabel = useFormLabel;
