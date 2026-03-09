"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _743QABRAcjs = require('./743QABRA.cjs');

// src/role/role.tsx
var TagName = "div";
var elements = [
  "a",
  "button",
  "details",
  "dialog",
  "div",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "section",
  "select",
  "span",
  "summary",
  "textarea",
  "ul",
  "svg"
];
var useRole = _743QABRAcjs.createHook.call(void 0, 
  function useRole2(props) {
    return props;
  }
);
var Role = _743QABRAcjs.forwardRef.call(void 0, 
  // @ts-expect-error
  function Role2(props) {
    return _743QABRAcjs.createElement.call(void 0, TagName, props);
  }
);
Object.assign(
  Role,
  elements.reduce((acc, element) => {
    acc[element] = _743QABRAcjs.forwardRef.call(void 0, function Role3(props) {
      return _743QABRAcjs.createElement.call(void 0, element, props);
    });
    return acc;
  }, {})
);




exports.useRole = useRole; exports.Role = Role;
