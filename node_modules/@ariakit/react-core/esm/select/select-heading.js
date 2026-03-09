"use client";
import {
  SelectHeadingContext
} from "../__chunks/AEGCXJZV.js";
import {
  usePopoverHeading
} from "../__chunks/4WJCKDQE.js";
import "../__chunks/O4VW3LHI.js";
import "../__chunks/FLYCYZJT.js";
import "../__chunks/CZ4GFWYL.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useId,
  useSafeLayoutEffect
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-heading.tsx
import { useContext } from "react";
var TagName = "h1";
var useSelectHeading = createHook(
  function useSelectHeading2(props) {
    const [, setHeadingId] = useContext(SelectHeadingContext) || [];
    const id = useId(props.id);
    useSafeLayoutEffect(() => {
      setHeadingId == null ? void 0 : setHeadingId(id);
      return () => setHeadingId == null ? void 0 : setHeadingId(void 0);
    }, [setHeadingId, id]);
    props = {
      id,
      ...props
    };
    props = usePopoverHeading(props);
    return props;
  }
);
var SelectHeading = forwardRef(function SelectHeading2(props) {
  const htmlProps = useSelectHeading(props);
  return createElement(TagName, htmlProps);
});
export {
  SelectHeading,
  useSelectHeading
};
