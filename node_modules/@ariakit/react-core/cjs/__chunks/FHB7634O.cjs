"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _SS26HAQ2cjs = require('./SS26HAQ2.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/form/form-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_SS26HAQ2cjs.CollectionContextProvider],
  [_SS26HAQ2cjs.CollectionScopedContextProvider]
);
var useFormContext = ctx.useContext;
var useFormScopedContext = ctx.useScopedContext;
var useFormProviderContext = ctx.useProviderContext;
var FormContextProvider = ctx.ContextProvider;
var FormScopedContextProvider = ctx.ScopedContextProvider;







exports.useFormContext = useFormContext; exports.useFormScopedContext = useFormScopedContext; exports.useFormProviderContext = useFormProviderContext; exports.FormContextProvider = FormContextProvider; exports.FormScopedContextProvider = FormScopedContextProvider;
