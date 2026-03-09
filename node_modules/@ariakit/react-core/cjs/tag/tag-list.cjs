"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _DIH46ZNHcjs = require('../__chunks/DIH46ZNH.cjs');



var _THHAUPXTcjs = require('../__chunks/THHAUPXT.cjs');


var _YTQONGS5cjs = require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tag/tag-list.tsx
var _events = require('@ariakit/core/utils/events');
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _platform = require('@ariakit/core/utils/platform');
var _undo = require('@ariakit/core/utils/undo');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useTagList = _743QABRAcjs.createHook.call(void 0, 
  function useTagList2({ store, ...props }) {
    const context = _THHAUPXTcjs.useTagProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TagList must receive a `store` prop or be wrapped in a TagProvider component."
    );
    const onMouseDownProp = props.onMouseDown;
    const onMouseDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onMouseDownProp == null ? void 0 : onMouseDownProp(event);
      if (event.defaultPrevented) return;
      const target = event.target;
      const currentTarget = event.currentTarget;
      const focusableTarget = _focus.getClosestFocusable.call(void 0, target);
      const isSelfFocusable = focusableTarget === currentTarget;
      if (!isSelfFocusable && currentTarget.contains(focusableTarget)) return;
      const { inputElement } = store.getState();
      _events.queueBeforeEvent.call(void 0, event.currentTarget, "mouseup", () => {
        inputElement == null ? void 0 : inputElement.focus();
      });
    });
    const onKeyDownProp = props.onKeyDown;
    const onKeyDown = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      const pc = !_platform.isApple.call(void 0, );
      const z = event.key === "z" || event.key === "Z";
      const mod = pc ? event.ctrlKey : event.metaKey;
      const shiftZ = event.shiftKey && z || pc && event.key === "y";
      if (mod && shiftZ) {
        event.preventDefault();
        _undo.UndoManager.redo();
      } else if (mod && z) {
        event.preventDefault();
        _undo.UndoManager.undo();
      }
    });
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _THHAUPXTcjs.TagScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      ...props,
      onMouseDown,
      onKeyDown
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, ...props });
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    const items = store.useState((state) => state.renderedItems);
    const itemIds = items.filter((item) => !!item.value).map((item) => item.id);
    const labelId = store.useState((state) => {
      var _a;
      return (_a = state.labelElement) == null ? void 0 : _a.id;
    });
    const listboxProps = {};
    for (const key in props) {
      if (key === "role" || key.startsWith("aria-")) {
        const prop = key;
        listboxProps[prop] = props[prop];
        delete props[prop];
      }
    }
    const touchDevice = _DIH46ZNHcjs.useTouchDevice.call(void 0, );
    const children = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          role: touchDevice ? "list" : "listbox",
          "aria-live": "polite",
          "aria-relevant": "all",
          "aria-atomic": true,
          "aria-labelledby": labelId,
          "aria-orientation": orientation,
          "aria-owns": itemIds.join(" "),
          ...listboxProps,
          style: { position: "fixed" }
        }
      ),
      props.children
    ] });
    props = {
      ...props,
      children
    };
    return props;
  }
);
var TagList = _743QABRAcjs.forwardRef.call(void 0, function TagList2(props) {
  const htmlProps = useTagList(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TagList = TagList; exports.useTagList = useTagList;
