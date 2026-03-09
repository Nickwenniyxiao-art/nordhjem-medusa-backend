"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/radio/radio-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useRadioContext = ctx.useContext;
var useRadioScopedContext = ctx.useScopedContext;
var useRadioProviderContext = ctx.useProviderContext;
var RadioContextProvider = ctx.ContextProvider;
var RadioScopedContextProvider = ctx.ScopedContextProvider;







exports.useRadioContext = useRadioContext; exports.useRadioScopedContext = useRadioScopedContext; exports.useRadioProviderContext = useRadioProviderContext; exports.RadioContextProvider = RadioContextProvider; exports.RadioScopedContextProvider = RadioScopedContextProvider;
