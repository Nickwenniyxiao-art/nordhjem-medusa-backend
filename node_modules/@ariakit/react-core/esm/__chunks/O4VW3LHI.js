"use client";
import {
  useHeading
} from "./FLYCYZJT.js";
import {
  DialogHeadingContext
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

// src/dialog/dialog-heading.tsx
import { useContext } from "react";
var TagName = "h1";
var useDialogHeading = createHook(
  function useDialogHeading2({ store, ...props }) {
    const setHeadingId = useContext(DialogHeadingContext);
    const id = useId(props.id);
    useSafeLayoutEffect(() => {
      setHeadingId == null ? void 0 : setHeadingId(id);
      return () => setHeadingId == null ? void 0 : setHeadingId(void 0);
    }, [setHeadingId, id]);
    props = {
      id,
      ...props
    };
    props = useHeading(props);
    return props;
  }
);
var DialogHeading = forwardRef(function DialogHeading2(props) {
  const htmlProps = useDialogHeading(props);
  return createElement(TagName, htmlProps);
});

export {
  useDialogHeading,
  DialogHeading
};
