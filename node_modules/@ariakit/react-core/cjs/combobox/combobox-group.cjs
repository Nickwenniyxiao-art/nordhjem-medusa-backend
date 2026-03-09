"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _5GHA7P5Fcjs = require('../__chunks/5GHA7P5F.cjs');
require('../__chunks/62RIM242.cjs');
require('../__chunks/XRATBFDX.cjs');


var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-group.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var TagName = "div";
var useComboboxGroup = _743QABRAcjs.createHook.call(void 0, 
  function useComboboxGroup2({ store, ...props }) {
    const context = _MLRWKUIEcjs.useComboboxScopedContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "ComboboxRow must be wrapped in a ComboboxList or ComboboxPopover component"
    );
    const contentElement = store.useState("contentElement");
    const popupRole = _dom.getPopupRole.call(void 0, contentElement);
    if (popupRole === "grid") {
      props = { role: "rowgroup", ...props };
    }
    props = _5GHA7P5Fcjs.useCompositeGroup.call(void 0, { store, ...props });
    return props;
  }
);
var ComboboxGroup = _743QABRAcjs.forwardRef.call(void 0, function ComboboxGroup2(props) {
  const htmlProps = useComboboxGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ComboboxGroup = ComboboxGroup; exports.useComboboxGroup = useComboboxGroup;
