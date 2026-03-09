"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _VGI2PE2Bcjs = require('../__chunks/VGI2PE2B.cjs');
require('../__chunks/ZPT6IQKO.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/focus-trap/focus-trap-region.tsx
var _focus = require('@ariakit/core/utils/focus');
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useFocusTrapRegion = _743QABRAcjs.createHook.call(void 0, 
  function useFocusTrapRegion2({ enabled = false, ...props }) {
    const ref = _react.useRef.call(void 0, null);
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => {
        const renderFocusTrap = () => {
          if (!enabled) return null;
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _VGI2PE2Bcjs.FocusTrap,
            {
              onFocus: (event) => {
                const container = ref.current;
                if (!container) return;
                const tabbables = _focus.getAllTabbableIn.call(void 0, container, true);
                const first = tabbables[0];
                const last = tabbables[tabbables.length - 1];
                if (!tabbables.length) {
                  container.focus();
                  return;
                }
                if (event.relatedTarget === first) {
                  last == null ? void 0 : last.focus();
                } else {
                  first == null ? void 0 : first.focus();
                }
              }
            }
          );
        };
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          renderFocusTrap(),
          element,
          renderFocusTrap()
        ] });
      },
      [enabled]
    );
    props = {
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref)
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var FocusTrapRegion = _743QABRAcjs.forwardRef.call(void 0, function FocusTrapRegion2(props) {
  const htmlProps = useFocusTrapRegion(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.FocusTrapRegion = FocusTrapRegion; exports.useFocusTrapRegion = useFocusTrapRegion;
