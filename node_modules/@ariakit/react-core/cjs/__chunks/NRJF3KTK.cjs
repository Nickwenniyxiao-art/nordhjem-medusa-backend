"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _HHXD2YNZcjs = require('./HHXD2YNZ.cjs');


var _DIWKSV34cjs = require('./DIWKSV34.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');





var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/disclosure/disclosure.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "button";
var symbol = Symbol("disclosure");
var useDisclosure = _743QABRAcjs.createHook.call(void 0, 
  function useDisclosure2({ store, toggleOnClick = true, ...props }) {
    const context = _HHXD2YNZcjs.useDisclosureProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "Disclosure must receive a `store` prop or be wrapped in a DisclosureProvider component."
    );
    const ref = _react.useRef.call(void 0, null);
    const [expanded, setExpanded] = _react.useState.call(void 0, false);
    const disclosureElement = store.useState("disclosureElement");
    const open = store.useState("open");
    _react.useEffect.call(void 0, () => {
      let isCurrentDisclosure = disclosureElement === ref.current;
      if (!(disclosureElement == null ? void 0 : disclosureElement.isConnected)) {
        store == null ? void 0 : store.setDisclosureElement(ref.current);
        isCurrentDisclosure = true;
      }
      setExpanded(open && isCurrentDisclosure);
    }, [disclosureElement, store, open]);
    const onClickProp = props.onClick;
    const toggleOnClickProp = _KGFTRA3Ccjs.useBooleanEvent.call(void 0, toggleOnClick);
    const [isDuplicate, metadataProps] = _KGFTRA3Ccjs.useMetadataProps.call(void 0, props, symbol, true);
    const onClick = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
      onClickProp == null ? void 0 : onClickProp(event);
      if (event.defaultPrevented) return;
      if (isDuplicate) return;
      if (!toggleOnClickProp(event)) return;
      store == null ? void 0 : store.setDisclosureElement(event.currentTarget);
      store == null ? void 0 : store.toggle();
    });
    const contentElement = store.useState("contentElement");
    props = {
      "aria-expanded": expanded,
      "aria-controls": contentElement == null ? void 0 : contentElement.id,
      ...metadataProps,
      ...props,
      ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref),
      onClick
    };
    props = _DIWKSV34cjs.useButton.call(void 0, props);
    return props;
  }
);
var Disclosure = _743QABRAcjs.forwardRef.call(void 0, function Disclosure2(props) {
  const htmlProps = useDisclosure(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useDisclosure = useDisclosure; exports.Disclosure = Disclosure;
