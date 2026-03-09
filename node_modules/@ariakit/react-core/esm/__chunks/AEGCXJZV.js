"use client";
import {
  PopoverContextProvider,
  PopoverScopedContextProvider
} from "./JMU4N4M5.js";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/select/select-context.tsx
import { createContext } from "react";
var ctx = createStoreContext(
  [PopoverContextProvider, CompositeContextProvider],
  [PopoverScopedContextProvider, CompositeScopedContextProvider]
);
var useSelectContext = ctx.useContext;
var useSelectScopedContext = ctx.useScopedContext;
var useSelectProviderContext = ctx.useProviderContext;
var SelectContextProvider = ctx.ContextProvider;
var SelectScopedContextProvider = ctx.ScopedContextProvider;
var SelectItemCheckedContext = createContext(false);
var SelectHeadingContext = createContext(null);

export {
  useSelectContext,
  useSelectScopedContext,
  useSelectProviderContext,
  SelectContextProvider,
  SelectScopedContextProvider,
  SelectItemCheckedContext,
  SelectHeadingContext
};
