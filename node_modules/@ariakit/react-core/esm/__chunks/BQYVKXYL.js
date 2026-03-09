"use client";
import {
  CollectionContextProvider,
  CollectionScopedContextProvider
} from "./SMPCIMZM.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/form/form-context.tsx
var ctx = createStoreContext(
  [CollectionContextProvider],
  [CollectionScopedContextProvider]
);
var useFormContext = ctx.useContext;
var useFormScopedContext = ctx.useScopedContext;
var useFormProviderContext = ctx.useProviderContext;
var FormContextProvider = ctx.ContextProvider;
var FormScopedContextProvider = ctx.ScopedContextProvider;

export {
  useFormContext,
  useFormScopedContext,
  useFormProviderContext,
  FormContextProvider,
  FormScopedContextProvider
};
