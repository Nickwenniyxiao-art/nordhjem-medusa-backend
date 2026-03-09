"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FHB7634Ocjs = require('../__chunks/FHB7634O.cjs');


var _UUGJI255cjs = require('../__chunks/UUGJI255.cjs');


var _DIWKSV34cjs = require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/form/form-push.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "button";
function getFirstFieldsByName(items, name) {
  if (!items) return [];
  const fields = [];
  for (const item of items) {
    if (item.type !== "field") continue;
    if (!item.name.startsWith(name)) continue;
    const nameWithIndex = item.name.replace(/(\.\d+)\..+$/, "$1");
    const regex = new RegExp(`^${nameWithIndex}`);
    if (!fields.some((i) => regex.test(i.name))) {
      fields.push(item);
    }
  }
  return fields;
}
var useFormPush = _743QABRAcjs.createHook.call(void 0, 
  function useFormPush2({
    store,
    value,
    name: nameProp,
    getItem: getItemProp,
    autoFocusOnClick = true,
    ...props
  }) {
    const context = _FHB7634Ocjs.useFormContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "FormPush must be wrapped in a Form component."
    );
    const name = `${nameProp}`;
    const [shouldFocus, setShouldFocus] = _react.useState.call(void 0, false);
    _react.useEffect.call(void 0, () => {
      var _a;
      if (!shouldFocus) return;
      const items = getFirstFieldsByName(store == null ? void 0 : store.getState().items, name);
      const element = (_a = items == null ? void 0 : items[items.length - 1]) == null ? void 0 : _a.element;
      if (!element) return;
      element.focus();
      setShouldFocus(false);
    }, [store, shouldFocus, name]);
    const getItem = _react.useCallback.call(void 0, 
      (item) => {
        const nextItem = { ...item, type: "button", name };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [name, getItemProp]
    );
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      store == null ? void 0 : store.pushValue(name, value);
      if (!autoFocusOnClick) return;
      setShouldFocus(true);
    });
    props = {
      ...props,
      onClick
    };
    props = _DIWKSV34cjs.useButton.call(void 0, props);
    props = _UUGJI255cjs.useCollectionItem.call(void 0, { store, ...props, getItem });
    return props;
  }
);
var FormPush = _743QABRAcjs.forwardRef.call(void 0, function FormPush2(props) {
  const htmlProps = useFormPush(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FormPush = FormPush; exports.useFormPush = useFormPush;
