"use client";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/tag/tag-context.tsx
import { createContext } from "react";
var TagValueContext = createContext(null);
var TagRemoveIdContext = createContext(
  null
);
var ctx = createStoreContext(
  [CompositeContextProvider],
  [CompositeScopedContextProvider]
);
var useTagContext = ctx.useContext;
var useTagScopedContext = ctx.useScopedContext;
var useTagProviderContext = ctx.useProviderContext;
var TagContextProvider = ctx.ContextProvider;
var TagScopedContextProvider = ctx.ScopedContextProvider;

export {
  TagValueContext,
  TagRemoveIdContext,
  useTagContext,
  useTagScopedContext,
  useTagProviderContext,
  TagContextProvider,
  TagScopedContextProvider
};
