"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _KHJERDK3cjs = require('./KHJERDK3.cjs');


var _L634CRNJcjs = require('./L634CRNJ.cjs');


var _FBPPLGNNcjs = require('./FBPPLGNN.cjs');


var _W32FX7DMcjs = require('./W32FX7DM.cjs');


var _OLXEI7QXcjs = require('./OLXEI7QX.cjs');


var _TXUJ5BOCcjs = require('./TXUJ5BOC.cjs');


var _H2FXMMBNcjs = require('./H2FXMMBN.cjs');



var _LCWSLOYUcjs = require('./LCWSLOYU.cjs');


var _56NPFF7Pcjs = require('./56NPFF7P.cjs');


var _GX66UERWcjs = require('./GX66UERW.cjs');



var _26P4PLHIcjs = require('./26P4PLHI.cjs');


var _YVOQ2BCBcjs = require('./YVOQ2BCB.cjs');



var _3ZDSDKC6cjs = require('./3ZDSDKC6.cjs');


var _ZXVQQIOScjs = require('./ZXVQQIOS.cjs');





var _5BVSKVUNcjs = require('./5BVSKVUN.cjs');


var _4JH5Q6AQcjs = require('./4JH5Q6AQ.cjs');


var _YY2UXBEBcjs = require('./YY2UXBEB.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');








var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/dialog/dialog.tsx






var _dom = require('@ariakit/core/utils/dom');



var _events = require('@ariakit/core/utils/events');




var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _platform = require('@ariakit/core/utils/platform');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var isSafariBrowser = _platform.isSafari.call(void 0, );
function isAlreadyFocusingAnotherElement(dialog) {
  const activeElement = _dom.getActiveElement.call(void 0, );
  if (!activeElement) return false;
  if (dialog && _dom.contains.call(void 0, dialog, activeElement)) return false;
  if (_focus.isFocusable.call(void 0, activeElement)) return true;
  return false;
}
function getElementFromProp(prop, focusable = false) {
  if (!prop) return null;
  const element = "current" in prop ? prop.current : prop;
  if (!element) return null;
  if (focusable) return _focus.isFocusable.call(void 0, element) ? element : null;
  return element;
}
var useDialog = _743QABRAcjs.createHook.call(void 0, function useDialog2({
  store: storeProp,
  open: openProp,
  onClose,
  focusable = true,
  modal = true,
  portal = !!modal,
  backdrop = !!modal,
  hideOnEscape = true,
  hideOnInteractOutside = true,
  getPersistentElements,
  preventBodyScroll = !!modal,
  autoFocusOnShow = true,
  autoFocusOnHide = true,
  initialFocus,
  finalFocus,
  unmountOnHide,
  unstable_treeSnapshotKey,
  ...props
}) {
  const context = _5BVSKVUNcjs.useDialogProviderContext.call(void 0, );
  const ref = _react.useRef.call(void 0, null);
  const store = _ZXVQQIOScjs.useDialogStore.call(void 0, {
    store: storeProp || context,
    open: openProp,
    setOpen(open2) {
      if (open2) return;
      const dialog = ref.current;
      if (!dialog) return;
      const event = new Event("close", { bubbles: false, cancelable: true });
      if (onClose) {
        dialog.addEventListener("close", onClose, { once: true });
      }
      dialog.dispatchEvent(event);
      if (!event.defaultPrevented) return;
      store.setOpen(true);
    }
  });
  const { portalRef, domReady } = _KGFTRA3Ccjs.usePortalRef.call(void 0, portal, props.portalRef);
  const preserveTabOrderProp = props.preserveTabOrder;
  const preserveTabOrder = _YY2UXBEBcjs.useStoreState.call(void 0, 
    store,
    (state) => preserveTabOrderProp && !modal && state.mounted
  );
  const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
  const open = _YY2UXBEBcjs.useStoreState.call(void 0, store, "open");
  const mounted = _YY2UXBEBcjs.useStoreState.call(void 0, store, "mounted");
  const contentElement = _YY2UXBEBcjs.useStoreState.call(void 0, store, "contentElement");
  const hidden = _3ZDSDKC6cjs.isHidden.call(void 0, mounted, props.hidden, props.alwaysVisible);
  _H2FXMMBNcjs.usePreventBodyScroll.call(void 0, contentElement, id, preventBodyScroll && !hidden);
  _OLXEI7QXcjs.useHideOnInteractOutside.call(void 0, store, hideOnInteractOutside, domReady);
  const { wrapElement, nestedDialogs } = _TXUJ5BOCcjs.useNestedDialogs.call(void 0, store);
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, props, wrapElement, [wrapElement]);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    if (!open) return;
    const dialog = ref.current;
    const activeElement = _dom.getActiveElement.call(void 0, dialog, true);
    if (!activeElement) return;
    if (activeElement.tagName === "BODY") return;
    if (dialog && _dom.contains.call(void 0, dialog, activeElement)) return;
    store.setDisclosureElement(activeElement);
  }, [store, open]);
  if (isSafariBrowser) {
    _react.useEffect.call(void 0, () => {
      if (!mounted) return;
      const { disclosureElement } = store.getState();
      if (!disclosureElement) return;
      if (!_dom.isButton.call(void 0, disclosureElement)) return;
      const onMouseDown = () => {
        let receivedFocus = false;
        const onFocus = () => {
          receivedFocus = true;
        };
        const options = { capture: true, once: true };
        disclosureElement.addEventListener("focusin", onFocus, options);
        _events.queueBeforeEvent.call(void 0, disclosureElement, "mouseup", () => {
          disclosureElement.removeEventListener("focusin", onFocus, true);
          if (receivedFocus) return;
          _focus.focusIfNeeded.call(void 0, disclosureElement);
        });
      };
      disclosureElement.addEventListener("mousedown", onMouseDown);
      return () => {
        disclosureElement.removeEventListener("mousedown", onMouseDown);
      };
    }, [store, mounted]);
  }
  _react.useEffect.call(void 0, () => {
    if (!mounted) return;
    if (!domReady) return;
    const dialog = ref.current;
    if (!dialog) return;
    const win = _dom.getWindow.call(void 0, dialog);
    const viewport = win.visualViewport || win;
    const setViewportHeight = () => {
      var _a, _b;
      const height = (_b = (_a = win.visualViewport) == null ? void 0 : _a.height) != null ? _b : win.innerHeight;
      dialog.style.setProperty("--dialog-viewport-height", `${height}px`);
    };
    setViewportHeight();
    viewport.addEventListener("resize", setViewportHeight);
    return () => {
      viewport.removeEventListener("resize", setViewportHeight);
    };
  }, [mounted, domReady]);
  _react.useEffect.call(void 0, () => {
    if (!modal) return;
    if (!mounted) return;
    if (!domReady) return;
    const dialog = ref.current;
    if (!dialog) return;
    const existingDismiss = dialog.querySelector("[data-dialog-dismiss]");
    if (existingDismiss) return;
    return _W32FX7DMcjs.prependHiddenDismiss.call(void 0, dialog, store.hide);
  }, [store, modal, mounted, domReady]);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    if (!_56NPFF7Pcjs.supportsInert.call(void 0, )) return;
    if (open) return;
    if (!mounted) return;
    if (!domReady) return;
    const dialog = ref.current;
    if (!dialog) return;
    return _LCWSLOYUcjs.disableTree.call(void 0, dialog);
  }, [open, mounted, domReady]);
  const canTakeTreeSnapshot = open && domReady;
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    if (!id) return;
    if (!canTakeTreeSnapshot) return;
    const dialog = ref.current;
    return _YVOQ2BCBcjs.createWalkTreeSnapshot.call(void 0, id, [dialog]);
  }, [id, canTakeTreeSnapshot, unstable_treeSnapshotKey]);
  const getPersistentElementsProp = _KGFTRA3Ccjs.useEvent.call(void 0, getPersistentElements);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    if (!id) return;
    if (!canTakeTreeSnapshot) return;
    const { disclosureElement } = store.getState();
    const dialog = ref.current;
    const persistentElements = getPersistentElementsProp() || [];
    const allElements = [
      dialog,
      ...persistentElements,
      ...nestedDialogs.map((dialog2) => dialog2.getState().contentElement)
    ];
    if (modal) {
      return _misc.chain.call(void 0, 
        _26P4PLHIcjs.markTreeOutside.call(void 0, id, allElements),
        _LCWSLOYUcjs.disableTreeOutside.call(void 0, id, allElements)
      );
    }
    return _26P4PLHIcjs.markTreeOutside.call(void 0, id, [disclosureElement, ...allElements]);
  }, [
    id,
    store,
    canTakeTreeSnapshot,
    getPersistentElementsProp,
    nestedDialogs,
    modal,
    unstable_treeSnapshotKey
  ]);
  const mayAutoFocusOnShow = !!autoFocusOnShow;
  const autoFocusOnShowProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, autoFocusOnShow);
  const [autoFocusEnabled, setAutoFocusEnabled] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (!open) return;
    if (!mayAutoFocusOnShow) return;
    if (!domReady) return;
    if (!(contentElement == null ? void 0 : contentElement.isConnected)) return;
    const element = getElementFromProp(initialFocus, true) || // If no initial focus is specified, we try to focus the first element
    // with the autofocus attribute. If it's an Ariakit component, the
    // Focusable component will consume the autoFocus prop and add the
    // data-autofocus attribute to the element instead.
    contentElement.querySelector(
      "[data-autofocus=true],[autofocus]"
    ) || // We have to fallback to the first focusable element otherwise portaled
    // dialogs with preserveTabOrder set to true will not receive focus
    // properly because the elements aren't tabbable until the dialog receives
    // focus.
    _focus.getFirstTabbableIn.call(void 0, contentElement, true, portal && preserveTabOrder) || // Finally, we fallback to the dialog element itself.
    contentElement;
    const isElementFocusable = _focus.isFocusable.call(void 0, element);
    if (!autoFocusOnShowProp(isElementFocusable ? element : null)) return;
    setAutoFocusEnabled(true);
    queueMicrotask(() => {
      element.focus();
      if (!isSafariBrowser) return;
      if (!isElementFocusable) return;
      element.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }, [
    open,
    mayAutoFocusOnShow,
    domReady,
    contentElement,
    initialFocus,
    portal,
    preserveTabOrder,
    autoFocusOnShowProp
  ]);
  const mayAutoFocusOnHide = !!autoFocusOnHide;
  const autoFocusOnHideProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, autoFocusOnHide);
  const [hasOpened, setHasOpened] = _react.useState.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (!open) return;
    setHasOpened(true);
    return () => setHasOpened(false);
  }, [open]);
  const focusOnHide = _react.useCallback.call(void 0, 
    (dialog, retry = true) => {
      const { disclosureElement } = store.getState();
      if (isAlreadyFocusingAnotherElement(dialog)) return;
      let element = getElementFromProp(finalFocus) || disclosureElement;
      if (element == null ? void 0 : element.id) {
        const doc = _dom.getDocument.call(void 0, element);
        const selector = `[aria-activedescendant="${element.id}"]`;
        const composite = doc.querySelector(selector);
        if (composite) {
          element = composite;
        }
      }
      if (element && !_focus.isFocusable.call(void 0, element)) {
        const maybeParentDialog = element.closest("[data-dialog]");
        if (maybeParentDialog == null ? void 0 : maybeParentDialog.id) {
          const doc = _dom.getDocument.call(void 0, maybeParentDialog);
          const selector = `[aria-controls~="${maybeParentDialog.id}"]`;
          const control = doc.querySelector(selector);
          if (control) {
            element = control;
          }
        }
      }
      const isElementFocusable = element && _focus.isFocusable.call(void 0, element);
      if (!isElementFocusable && retry) {
        requestAnimationFrame(() => focusOnHide(dialog, false));
        return;
      }
      if (!autoFocusOnHideProp(isElementFocusable ? element : null)) return;
      if (!isElementFocusable) return;
      element == null ? void 0 : element.focus({ preventScroll: true });
    },
    [store, finalFocus, autoFocusOnHideProp]
  );
  const focusedOnHideRef = _react.useRef.call(void 0, false);
  _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
    if (open) return;
    if (!hasOpened) return;
    if (!mayAutoFocusOnHide) return;
    const dialog = ref.current;
    focusedOnHideRef.current = true;
    focusOnHide(dialog);
  }, [open, hasOpened, domReady, mayAutoFocusOnHide, focusOnHide]);
  _react.useEffect.call(void 0, () => {
    if (!hasOpened) return;
    if (!mayAutoFocusOnHide) return;
    const dialog = ref.current;
    return () => {
      if (focusedOnHideRef.current) {
        focusedOnHideRef.current = false;
        return;
      }
      focusOnHide(dialog);
    };
  }, [hasOpened, mayAutoFocusOnHide, focusOnHide]);
  const hideOnEscapeProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, hideOnEscape);
  _react.useEffect.call(void 0, () => {
    if (!domReady) return;
    if (!mounted) return;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;
      const dialog = ref.current;
      if (!dialog) return;
      if (_26P4PLHIcjs.isElementMarked.call(void 0, dialog)) return;
      const target = event.target;
      if (!target) return;
      const { disclosureElement } = store.getState();
      const isValidTarget = () => {
        if (target.tagName === "BODY") return true;
        if (_dom.contains.call(void 0, dialog, target)) return true;
        if (!disclosureElement) return true;
        if (_dom.contains.call(void 0, disclosureElement, target)) return true;
        return false;
      };
      if (!isValidTarget()) return;
      if (!hideOnEscapeProp(event)) return;
      store.hide();
    };
    return _events.addGlobalEventListener.call(void 0, "keydown", onKeyDown, true);
  }, [store, domReady, mounted, hideOnEscapeProp]);
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L634CRNJcjs.HeadingLevel, { level: modal ? 1 : void 0, children: element }),
    [modal]
  );
  const hiddenProp = props.hidden;
  const alwaysVisible = props.alwaysVisible;
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => {
      if (!backdrop) return element;
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _GX66UERWcjs.DialogBackdrop,
          {
            store,
            backdrop,
            hidden: hiddenProp,
            alwaysVisible
          }
        ),
        element
      ] });
    },
    [store, backdrop, hiddenProp, alwaysVisible]
  );
  const [headingId, setHeadingId] = _react.useState.call(void 0, );
  const [descriptionId, setDescriptionId] = _react.useState.call(void 0, );
  props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
    props,
    (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _5BVSKVUNcjs.DialogScopedContextProvider, { value: store, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _5BVSKVUNcjs.DialogHeadingContext.Provider, { value: setHeadingId, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _5BVSKVUNcjs.DialogDescriptionContext.Provider, { value: setDescriptionId, children: element }) }) }),
    [store]
  );
  props = {
    id,
    "data-dialog": "",
    role: "dialog",
    tabIndex: focusable ? -1 : void 0,
    "aria-labelledby": headingId,
    "aria-describedby": descriptionId,
    ...props,
    ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
  };
  props = _FBPPLGNNcjs.useFocusableContainer.call(void 0, {
    ...props,
    autoFocusOnShow: autoFocusEnabled
  });
  props = _3ZDSDKC6cjs.useDisclosureContent.call(void 0, { store, ...props });
  props = _4JH5Q6AQcjs.useFocusable.call(void 0, { ...props, focusable });
  props = _KHJERDK3cjs.usePortal.call(void 0, { portal, ...props, portalRef, preserveTabOrder });
  return props;
});
function createDialogComponent(Component, useProviderContext = _5BVSKVUNcjs.useDialogProviderContext) {
  return _743QABRAcjs.forwardRef.call(void 0, function DialogComponent(props) {
    const context = useProviderContext();
    const store = props.store || context;
    const mounted = _YY2UXBEBcjs.useStoreState.call(void 0, 
      store,
      (state) => !props.unmountOnHide || (state == null ? void 0 : state.mounted) || !!props.open
    );
    if (!mounted) return null;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, { ...props });
  });
}
var Dialog = createDialogComponent(
  _743QABRAcjs.forwardRef.call(void 0, function Dialog2(props) {
    const htmlProps = useDialog(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _5BVSKVUNcjs.useDialogProviderContext
);





exports.useDialog = useDialog; exports.createDialogComponent = createDialogComponent; exports.Dialog = Dialog;
