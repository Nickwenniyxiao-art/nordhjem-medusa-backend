"use client";
import {
  GroupLabelContext
} from "./7HVFURXT.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";
import {
  useId,
  useSafeLayoutEffect
} from "./KPHZR4MB.js";

// src/group/group-label.tsx
import { removeUndefinedValues } from "@ariakit/core/utils/misc";
import { useContext } from "react";
var TagName = "div";
var useGroupLabel = createHook(
  function useGroupLabel2(props) {
    const setLabelId = useContext(GroupLabelContext);
    const id = useId(props.id);
    useSafeLayoutEffect(() => {
      setLabelId == null ? void 0 : setLabelId(id);
      return () => setLabelId == null ? void 0 : setLabelId(void 0);
    }, [setLabelId, id]);
    props = {
      id,
      "aria-hidden": true,
      ...props
    };
    return removeUndefinedValues(props);
  }
);
var GroupLabel = forwardRef(function GroupLabel2(props) {
  const htmlProps = useGroupLabel(props);
  return createElement(TagName, htmlProps);
});

export {
  useGroupLabel,
  GroupLabel
};
