"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _HHXD2YNZcjs = require('./HHXD2YNZ.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/dialog/dialog-context.tsx
var _react = require('react');
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_HHXD2YNZcjs.DisclosureContextProvider],
  [_HHXD2YNZcjs.DisclosureScopedContextProvider]
);
var useDialogContext = ctx.useContext;
var useDialogScopedContext = ctx.useScopedContext;
var useDialogProviderContext = ctx.useProviderContext;
var DialogContextProvider = ctx.ContextProvider;
var DialogScopedContextProvider = ctx.ScopedContextProvider;
var DialogHeadingContext = _react.createContext.call(void 0, void 0);
var DialogDescriptionContext = _react.createContext.call(void 0, void 0);









exports.useDialogContext = useDialogContext; exports.useDialogScopedContext = useDialogScopedContext; exports.useDialogProviderContext = useDialogProviderContext; exports.DialogContextProvider = DialogContextProvider; exports.DialogScopedContextProvider = DialogScopedContextProvider; exports.DialogHeadingContext = DialogHeadingContext; exports.DialogDescriptionContext = DialogDescriptionContext;
