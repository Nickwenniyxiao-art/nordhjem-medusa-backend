"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _AI6VIQ5Fcjs = require('../__chunks/AI6VIQ5F.cjs');
require('../__chunks/OISF5P4T.cjs');
require('../__chunks/6AOESUW6.cjs');
require('../__chunks/JLMLKTUB.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-heading.tsx
var _react = require('react');
var TagName = "h1";
var useSelectHeading = _743QABRAcjs.createHook.call(void 0, 
  function useSelectHeading2(props) {
    const [, setHeadingId] = _react.useContext.call(void 0, _4NZHMZNFcjs.SelectHeadingContext) || [];
    const id = _KGFTRA3Ccjs.useId.call(void 0, props.id);
    _KGFTRA3Ccjs.useSafeLayoutEffect.call(void 0, () => {
      setHeadingId == null ? void 0 : setHeadingId(id);
      return () => setHeadingId == null ? void 0 : setHeadingId(void 0);
    }, [setHeadingId, id]);
    props = {
      id,
      ...props
    };
    props = _AI6VIQ5Fcjs.usePopoverHeading.call(void 0, props);
    return props;
  }
);
var SelectHeading = _743QABRAcjs.forwardRef.call(void 0, function SelectHeading2(props) {
  const htmlProps = useSelectHeading(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.SelectHeading = SelectHeading; exports.useSelectHeading = useSelectHeading;
