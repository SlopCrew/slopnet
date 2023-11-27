import React from "react";
import FakeTMP from "./FakeTMP";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TMPInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [text, setText] = React.useState<string>("");

    return (
      <>
        <FakeTMP text={text} />

        <input
          type="text"
          ref={ref}
          onChange={(e) => setText(e.target.value)}
          {...props}
        />
      </>
    );
  }
);

export default TMPInput;
