"use client";
import {
  useGroup
} from "./Y6I7WX7H.js";
import {
  createElement,
  createHook,
  forwardRef
} from "./GWSL6KNJ.js";

// src/form/form-group.tsx
var TagName = "div";
var useFormGroup = createHook(
  function useFormGroup2({ store, ...props }) {
    props = useGroup(props);
    return props;
  }
);
var FormGroup = forwardRef(function FormGroup2(props) {
  const htmlProps = useFormGroup(props);
  return createElement(TagName, htmlProps);
});

export {
  useFormGroup,
  FormGroup
};
