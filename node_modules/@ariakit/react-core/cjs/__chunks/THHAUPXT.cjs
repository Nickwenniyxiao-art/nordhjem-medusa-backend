"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/tag/tag-context.tsx
var _react = require('react');
var TagValueContext = _react.createContext.call(void 0, null);
var TagRemoveIdContext = _react.createContext.call(void 0, 
  null
);
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useTagContext = ctx.useContext;
var useTagScopedContext = ctx.useScopedContext;
var useTagProviderContext = ctx.useProviderContext;
var TagContextProvider = ctx.ContextProvider;
var TagScopedContextProvider = ctx.ScopedContextProvider;









exports.TagValueContext = TagValueContext; exports.TagRemoveIdContext = TagRemoveIdContext; exports.useTagContext = useTagContext; exports.useTagScopedContext = useTagScopedContext; exports.useTagProviderContext = useTagProviderContext; exports.TagContextProvider = TagContextProvider; exports.TagScopedContextProvider = TagScopedContextProvider;
