"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ANXWSPVQcjs = require('../__chunks/ANXWSPVQ.cjs');



var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');
require('../__chunks/PCBYE2BJ.cjs');


var _7WQJLR5Ucjs = require('../__chunks/7WQJLR5U.cjs');


var _V4CSM2URcjs = require('../__chunks/V4CSM2UR.cjs');
require('../__chunks/YQMDNMVH.cjs');
require('../__chunks/HY6WXQ7B.cjs');
require('../__chunks/NRJF3KTK.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');





var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select.tsx
var _array = require('@ariakit/core/utils/array');
var _dom = require('@ariakit/core/utils/dom');
var _events = require('@ariakit/core/utils/events');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
function getSelectedValues(select) {
  return Array.from(select.selectedOptions).map((option) => option.value);
}
function nextWithValue(store, next) {
  return () => {
    const nextId = next();
    if (!nextId) return;
    let i = 0;
    let nextItem = store.item(nextId);
    const firstItem = nextItem;
    while (nextItem && nextItem.value == null) {
      const nextId2 = next(++i);
      if (!nextId2) return;
      nextItem = store.item(nextId2);
      if (nextItem === firstItem) break;
    }
    return nextItem == null ? void 0 : nextItem.id;
  };
}
var useSelect = _743QABRAcjs.createHook.call(void 0, function useSelect2({
  store,
  name,
  form,
  required,
  showOnKeyDown = true,
  moveOnKeyDown = true,
  toggleOnPress = true,
  toggleOnClick = toggleOnPress,
  ...props
}) {
  const context = _4NZHMZNFcjs.useSelectProviderContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "Select must receive a `store` prop or be wrapped in a SelectProvider component."
  );
  const onKeyDownProp = props.onKeyDown;
  const showOnKeyDownProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, showOnKeyDown);
  const moveOnKeyDownProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, moveOnKeyDown);
  const placement = store.useState("placement");
  const dir = placement.split("-")[0];
  const value = store.useState("value");
  const multiSelectable = Array.isArray(value);
  const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    var _a;
    onKeyDownProp == null ? void 0 : onKeyDownProp(event);
    if (event.defaultPrevented) return;
    if (!store) return;
    const { orientation, items: items2, activeId } = store.getState();
    const isVertical = orientation !== "horizontal";
    const isHorizontal = orientation !== "vertical";
    const isGrid = !!((_a = items2.find((item) => !item.disabled && item.value != null)) == null ? void 0 : _a.rowId);
    const moveKeyMap = {
      ArrowUp: (isGrid || isVertical) && nextWithValue(store, store.up),
      ArrowRight: (isGrid || isHorizontal) && nextWithValue(store, store.next),
      ArrowDown: (isGrid || isVertical) && nextWithValue(store, store.down),
      ArrowLeft: (isGrid || isHorizontal) && nextWithValue(store, store.previous)
    };
    const getId = moveKeyMap[event.key];
    if (getId && moveOnKeyDownProp(event)) {
      event.preventDefault();
      store.move(getId());
    }
    const isTopOrBottom = dir === "top" || dir === "bottom";
    const isLeft = dir === "left";
    const isRight = dir === "right";
    const canShowKeyMap = {
      ArrowDown: isTopOrBottom,
      ArrowUp: isTopOrBottom,
      ArrowLeft: isLeft,
      ArrowRight: isRight
    };
    const canShow = canShowKeyMap[event.key];
    if (canShow && showOnKeyDownProp(event)) {
      event.preventDefault();
      store.move(activeId);
      _events.queueBeforeEvent.call(void 0, event.currentTarget, "keyup", store.show);
    }
  });
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _4NZHMZNFcjs.SelectScopedContextProvider, { value: store, children: element }),
    [store]
  );
  const [autofill, setAutofill] = _react.useState.call(void 0, false);
  const nativeSelectChangedRef = _react.useRef.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    const nativeSelectChanged = nativeSelectChangedRef.current;
    nativeSelectChangedRef.current = false;
    if (nativeSelectChanged) return;
    setAutofill(false);
  }, [value]);
  const labelId = store.useState((state) => {
    var _a;
    return (_a = state.labelElement) == null ? void 0 : _a.id;
  });
  const label = props["aria-label"];
  const labelledBy = props["aria-labelledby"] || labelId;
  const items = store.useState((state) => {
    if (!name) return;
    return state.items;
  });
  const values = _react.useMemo.call(void 0, () => {
    return [...new Set(items == null ? void 0 : items.map((i) => i.value).filter((v) => v != null))];
  }, [items]);
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => {
      if (!name) return element;
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "select",
          {
            style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              whiteSpace: "nowrap",
              width: "1px"
            },
            tabIndex: -1,
            "aria-hidden": true,
            "aria-label": label,
            "aria-labelledby": labelledBy,
            name,
            form,
            required,
            disabled: props.disabled,
            value,
            multiple: multiSelectable,
            onFocus: () => {
              var _a;
              return (_a = store == null ? void 0 : store.getState().selectElement) == null ? void 0 : _a.focus();
            },
            onChange: (event) => {
              nativeSelectChangedRef.current = true;
              setAutofill(true);
              store == null ? void 0 : store.setValue(
                multiSelectable ? getSelectedValues(event.target) : event.target.value
              );
            },
            children: [
              _array.toArray.call(void 0, value).map((value2) => {
                if (value2 == null) return null;
                if (values.includes(value2)) return null;
                return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: value2, children: value2 }, value2);
              }),
              values.map((value2) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: value2, children: value2 }, value2))
            ]
          }
        ),
        element
      ] });
    },
    [
      store,
      label,
      labelledBy,
      name,
      form,
      required,
      value,
      multiSelectable,
      values,
      props.disabled
    ]
  );
  const children = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    value,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _ANXWSPVQcjs.SelectArrow, {})
  ] });
  const contentElement = store.useState("contentElement");
  props = {
    role: "combobox",
    "aria-autocomplete": "none",
    "aria-labelledby": labelId,
    "aria-haspopup": _dom.getPopupRole.call(void 0, contentElement, "listbox"),
    "data-autofill": autofill || void 0,
    "data-name": name,
    children,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store.setSelectElement, props.ref),
    onKeyDown
  };
  props = _V4CSM2URcjs.usePopoverDisclosure.call(void 0, { store, toggleOnClick, ...props });
  props = _7WQJLR5Ucjs.useCompositeTypeahead.call(void 0, { store, ...props });
  return props;
});
var Select = _743QABRAcjs.forwardRef.call(void 0, function Select2(props) {
  const htmlProps = useSelect(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.Select = Select; exports.useSelect = useSelect;
