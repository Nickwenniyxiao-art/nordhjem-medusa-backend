"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _J7ATZCFKcjs = require('../__chunks/J7ATZCFK.cjs');


var _ANHHZKY4cjs = require('../__chunks/ANHHZKY4.cjs');
require('../__chunks/KHJERDK3.cjs');
require('../__chunks/UI5KWBYV.cjs');
require('../__chunks/L634CRNJ.cjs');
require('../__chunks/VGI2PE2B.cjs');
require('../__chunks/ZPT6IQKO.cjs');
require('../__chunks/FBPPLGNN.cjs');
require('../__chunks/W32FX7DM.cjs');
require('../__chunks/OLXEI7QX.cjs');
require('../__chunks/6GRO3ZM4.cjs');
require('../__chunks/TXUJ5BOC.cjs');
require('../__chunks/H2FXMMBN.cjs');
require('../__chunks/5AGCRCKV.cjs');
require('../__chunks/JLMLKTUB.cjs');
require('../__chunks/LCWSLOYU.cjs');
require('../__chunks/V7JASX7S.cjs');
require('../__chunks/56NPFF7P.cjs');
require('../__chunks/GASMO7Y4.cjs');
require('../__chunks/GX66UERW.cjs');
require('../__chunks/26P4PLHI.cjs');
require('../__chunks/YVOQ2BCB.cjs');
require('../__chunks/4SKDRUBR.cjs');
require('../__chunks/AQ2LO7WV.cjs');


var _SM7ORVC7cjs = require('../__chunks/SM7ORVC7.cjs');
require('../__chunks/3ZDSDKC6.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');
require('../__chunks/L22B4P6Y.cjs');


var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');


var _YY2UXBEBcjs = require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/combobox/combobox-popover.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
function isController(target, ...ids) {
  if (!target) return false;
  if ("id" in target) {
    const selector = ids.filter(Boolean).map((id) => `[aria-controls~="${id}"]`).join(", ");
    if (!selector) return false;
    return target.matches(selector);
  }
  return false;
}
var useComboboxPopover = _743QABRAcjs.createHook.call(void 0, 
  function useComboboxPopover2({
    store,
    modal,
    tabIndex,
    alwaysVisible,
    autoFocusOnHide = true,
    hideOnInteractOutside = true,
    ...props
  }) {
    const context = _MLRWKUIEcjs.useComboboxProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "ComboboxPopover must receive a `store` prop or be wrapped in a ComboboxProvider component."
    );
    const baseElement = store.useState("baseElement");
    const hiddenByClickOutsideRef = _react.useRef.call(void 0, false);
    const treeSnapshotKey = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store.tag,
      (state) => state == null ? void 0 : state.renderedItems.length
    );
    props = _SM7ORVC7cjs.useComboboxList.call(void 0, { store, alwaysVisible, ...props });
    props = _J7ATZCFKcjs.usePopover.call(void 0, {
      store,
      modal,
      alwaysVisible,
      backdrop: false,
      autoFocusOnShow: false,
      finalFocus: baseElement,
      preserveTabOrderAnchor: null,
      unstable_treeSnapshotKey: treeSnapshotKey,
      ...props,
      // When the combobox popover is modal, we make sure to include the
      // combobox input and all the combobox controls (cancel, disclosure) in
      // the list of persistent elements so they make part of the modal context,
      // allowing users to tab through them.
      getPersistentElements() {
        var _a;
        const elements = ((_a = props.getPersistentElements) == null ? void 0 : _a.call(props)) || [];
        if (!modal) return elements;
        if (!store) return elements;
        const { contentElement, baseElement: baseElement2 } = store.getState();
        if (!baseElement2) return elements;
        const doc = _dom.getDocument.call(void 0, baseElement2);
        const selectors = [];
        if (contentElement == null ? void 0 : contentElement.id) {
          selectors.push(`[aria-controls~="${contentElement.id}"]`);
        }
        if (baseElement2 == null ? void 0 : baseElement2.id) {
          selectors.push(`[aria-controls~="${baseElement2.id}"]`);
        }
        if (!selectors.length) return [...elements, baseElement2];
        const selector = selectors.join(",");
        const controlElements = doc.querySelectorAll(selector);
        return [...elements, ...controlElements];
      },
      // The combobox popover should focus on the combobox input when it hides,
      // unless the event was triggered by a click outside the popover, in which
      // case the input shouldn't be re-focused.
      autoFocusOnHide(element) {
        if (_misc.isFalsyBooleanCallback.call(void 0, autoFocusOnHide, element)) return false;
        if (hiddenByClickOutsideRef.current) {
          hiddenByClickOutsideRef.current = false;
          return false;
        }
        return true;
      },
      // Make sure we don't hide the popover when the user interacts with the
      // combobox cancel or the combobox disclosure buttons. They will have the
      // aria-controls attribute pointing to either the combobox input or the
      // combobox popover elements.
      hideOnInteractOutside(event) {
        var _a, _b;
        const state = store == null ? void 0 : store.getState();
        const contentId = (_a = state == null ? void 0 : state.contentElement) == null ? void 0 : _a.id;
        const baseId = (_b = state == null ? void 0 : state.baseElement) == null ? void 0 : _b.id;
        if (isController(event.target, contentId, baseId)) return false;
        const result = typeof hideOnInteractOutside === "function" ? hideOnInteractOutside(event) : hideOnInteractOutside;
        if (result) {
          hiddenByClickOutsideRef.current = event.type === "click";
        }
        return result;
      }
    });
    return props;
  }
);
var ComboboxPopover = _ANHHZKY4cjs.createDialogComponent.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function ComboboxPopover2(props) {
    const htmlProps = useComboboxPopover(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _MLRWKUIEcjs.useComboboxProviderContext
);



exports.ComboboxPopover = ComboboxPopover; exports.useComboboxPopover = useComboboxPopover;
