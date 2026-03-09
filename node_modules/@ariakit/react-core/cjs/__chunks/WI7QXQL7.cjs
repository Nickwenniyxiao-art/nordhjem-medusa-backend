"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _SS26HAQ2cjs = require('./SS26HAQ2.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/composite/composite-context.tsx
var _react = require('react');
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_SS26HAQ2cjs.CollectionContextProvider],
  [_SS26HAQ2cjs.CollectionScopedContextProvider]
);
var useCompositeContext = ctx.useContext;
var useCompositeScopedContext = ctx.useScopedContext;
var useCompositeProviderContext = ctx.useProviderContext;
var CompositeContextProvider = ctx.ContextProvider;
var CompositeScopedContextProvider = ctx.ScopedContextProvider;
var CompositeItemContext = _react.createContext.call(void 0, 
  void 0
);
var CompositeRowContext = _react.createContext.call(void 0, 
  void 0
);









exports.useCompositeContext = useCompositeContext; exports.useCompositeScopedContext = useCompositeScopedContext; exports.useCompositeProviderContext = useCompositeProviderContext; exports.CompositeContextProvider = CompositeContextProvider; exports.CompositeScopedContextProvider = CompositeScopedContextProvider; exports.CompositeItemContext = CompositeItemContext; exports.CompositeRowContext = CompositeRowContext;
