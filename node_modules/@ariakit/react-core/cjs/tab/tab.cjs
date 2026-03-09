"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _L5UNQIH6cjs = require('../__chunks/L5UNQIH6.cjs');



var _WS3AS5PBcjs = require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tab/tab.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "button";
var useTab = _743QABRAcjs.createHook.call(void 0, function useTab2({
  store,
  getItem: getItemProp,
  ...props
}) {
  var _a;
  const context = _L5UNQIH6cjs.useTabScopedContext.call(void 0, );
  store = store || context;
  _misc.invariant.call(void 0, 
    store,
    process.env.NODE_ENV !== "production" && "Tab must be wrapped in a TabList component."
  );
  const defaultId = _KGFTRA3Ccjs.useId.call(void 0, );
  const id = props.id || defaultId;
  const dimmed = _misc.disabledFromProps.call(void 0, props);
  const getItem = _react.useCallback.call(void 0, 
    (item) => {
      const nextItem = { ...item, dimmed };
      if (getItemProp) {
        return getItemProp(nextItem);
      }
      return nextItem;
    },
    [dimmed, getItemProp]
  );
  const onClickProp = props.onClick;
  const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onClickProp == null ? void 0 : onClickProp(event);
    if (event.defaultPrevented) return;
    store == null ? void 0 : store.setSelectedId(id);
  });
  const panelId = store.panels.useState(
    (state) => {
      var _a2;
      return (_a2 = state.items.find((item) => item.tabId === id)) == null ? void 0 : _a2.id;
    }
  );
  const shouldRegisterItem = defaultId ? props.shouldRegisterItem : false;
  const isActive = store.useState((state) => !!id && state.activeId === id);
  const selected = store.useState((state) => !!id && state.selectedId === id);
  const hasActiveItem = store.useState((state) => !!store.item(state.activeId));
  const canRegisterComposedItem = isActive || selected && !hasActiveItem;
  const accessibleWhenDisabled = selected || ((_a = props.accessibleWhenDisabled) != null ? _a : true);
  const isWithinVirtualFocusComposite = _YY2UXBEBcjs.useStoreState.call(void 0, 
    store.combobox || store.composite,
    "virtualFocus"
  );
  if (isWithinVirtualFocusComposite) {
    props = {
      ...props,
      tabIndex: -1
    };
  }
  props = {
    id,
    role: "tab",
    "aria-selected": selected,
    "aria-controls": panelId || void 0,
    ...props,
    onClick
  };
  if (store.composite) {
    const defaultProps = {
      id,
      accessibleWhenDisabled,
      store: store.composite,
      shouldRegisterItem: canRegisterComposedItem && shouldRegisterItem,
      rowId: props.rowId,
      render: props.render
    };
    props = {
      ...props,
      render: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _WS3AS5PBcjs.CompositeItem,
        {
          ...defaultProps,
          render: store.combobox && store.composite !== store.combobox ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WS3AS5PBcjs.CompositeItem, { ...defaultProps, store: store.combobox }) : defaultProps.render
        }
      )
    };
  }
  props = _WS3AS5PBcjs.useCompositeItem.call(void 0, {
    store,
    ...props,
    accessibleWhenDisabled,
    getItem,
    shouldRegisterItem
  });
  return props;
});
var Tab = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Tab2(props) {
    const htmlProps = useTab(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.Tab = Tab; exports.useTab = useTab;
