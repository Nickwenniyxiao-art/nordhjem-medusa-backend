"use client";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/radio/radio-context.tsx
var ctx = createStoreContext(
  [CompositeContextProvider],
  [CompositeScopedContextProvider]
);
var useRadioContext = ctx.useContext;
var useRadioScopedContext = ctx.useScopedContext;
var useRadioProviderContext = ctx.useProviderContext;
var RadioContextProvider = ctx.ContextProvider;
var RadioScopedContextProvider = ctx.ScopedContextProvider;

export {
  useRadioContext,
  useRadioScopedContext,
  useRadioProviderContext,
  RadioContextProvider,
  RadioScopedContextProvider
};
