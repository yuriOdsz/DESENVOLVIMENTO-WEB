declare module "react-input-mask-next" {
  import * as React from "react";
  const InputMask: React.ForwardRefExoticComponent<
    React.InputHTMLAttributes<HTMLInputElement> & {
      mask: string;
      maskPlaceholder?: string | null;
    } & React.RefAttributes<HTMLInputElement>
  >;
  export default InputMask;
}
