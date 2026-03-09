"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _QHTB3O7Vcjs = require('../__chunks/QHTB3O7V.cjs');
require('../__chunks/IRJEBRAW.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-item-check.tsx
var _react = require('react');
var TagName = "span";
var useMenuItemCheck = _743QABRAcjs.createHook.call(void 0, 
  function useMenuItemCheck2({ store, checked, ...props }) {
    const context = _react.useContext.call(void 0, _JJQSOPYIcjs.MenuItemCheckedContext);
    checked = checked != null ? checked : context;
    props = _QHTB3O7Vcjs.useCheckboxCheck.call(void 0, { ...props, checked });
    return props;
  }
);
var MenuItemCheck = _743QABRAcjs.forwardRef.call(void 0, function MenuItemCheck2(props) {
  const htmlProps = useMenuItemCheck(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuItemCheck = MenuItemCheck; exports.useMenuItemCheck = useMenuItemCheck;
