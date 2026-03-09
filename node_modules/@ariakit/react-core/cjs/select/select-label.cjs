"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');




var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-label.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "div";
var useSelectLabel = _743QABRAcjs.createHook.call(void 0, 
  function useSelectLabel2({ store, ...props }) {
    const context = _4NZHMZNFcjs.useSelectProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "SelectLabel must receive a `store` prop or be wrapped in a SelectProvider component."
    );
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    const onClickProp = props.onClick;
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      queueMicrotask(() => {
        const select = store == null ? void 0 : store.getState().selectElement;
        select == null ? void 0 : select.focus();
      });
    });
    props = {
      id,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, store.setLabelElement, props.ref),
      onClick,
      style: {
        cursor: "default",
        ...props.style
      }
    };
    return _misc.removeUndefinedValues.call(void 0, props);
  }
);
var SelectLabel = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function SelectLabel2(props) {
    const htmlProps = useSelectLabel(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.SelectLabel = SelectLabel; exports.useSelectLabel = useSelectLabel;
