"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _2YNAELCXcjs = require('../__chunks/2YNAELCX.cjs');


var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');
require('../__chunks/7WQJLR5U.cjs');


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
require('../__chunks/3ZDSDKC6.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');
require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/L22B4P6Y.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-popover.tsx
var TagName = "div";
var useSelectPopover = _743QABRAcjs.createHook.call(void 0, 
  function useSelectPopover2({ store, alwaysVisible, ...props }) {
    const context = _4NZHMZNFcjs.useSelectProviderContext.call(void 0, );
    store = store || context;
    props = _2YNAELCXcjs.useSelectList.call(void 0, { store, alwaysVisible, ...props });
    props = _J7ATZCFKcjs.usePopover.call(void 0, { store, alwaysVisible, ...props });
    return props;
  }
);
var SelectPopover = _ANHHZKY4cjs.createDialogComponent.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function SelectPopover2(props) {
    const htmlProps = useSelectPopover(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _4NZHMZNFcjs.useSelectProviderContext
);



exports.SelectPopover = SelectPopover; exports.useSelectPopover = useSelectPopover;
