"use client";
import {
  DialogDescriptionContext
} from "./A62MDFCW.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useId,
  useSafeLayoutEffect
} from "./KPHZR4MB.js";

// src/dialog/dialog-description.tsx
import { removeUndefinedValues } from "@ariakit/core/utils/misc";
import { useContext } from "react";
var TagName = "p";
var useDialogDescription = createHook(function useDialogDescription2({ store, ...props }) {
  const setDescriptionId = useContext(DialogDescriptionContext);
  const id = useId(props.id);
  useSafeLayoutEffect(() => {
    setDescriptionId == null ? void 0 : setDescriptionId(id);
    return () => setDescriptionId == null ? void 0 : setDescriptionId(void 0);
  }, [setDescriptionId, id]);
  props = {
    id,
    ...props
  };
  return removeUndefinedValues(props);
});
var DialogDescription = forwardRef(function DialogDescription2(props) {
  const htmlProps = useDialogDescription(props);
  return createElement(TagName, htmlProps);
});

export {
  useDialogDescription,
  DialogDescription
};
