"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _743QABRAcjs = require('./743QABRA.cjs');

// src/collection/collection-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, );
var useCollectionContext = ctx.useContext;
var useCollectionScopedContext = ctx.useScopedContext;
var useCollectionProviderContext = ctx.useProviderContext;
var CollectionContextProvider = ctx.ContextProvider;
var CollectionScopedContextProvider = ctx.ScopedContextProvider;







exports.useCollectionContext = useCollectionContext; exports.useCollectionScopedContext = useCollectionScopedContext; exports.useCollectionProviderContext = useCollectionProviderContext; exports.CollectionContextProvider = CollectionContextProvider; exports.CollectionScopedContextProvider = CollectionScopedContextProvider;
