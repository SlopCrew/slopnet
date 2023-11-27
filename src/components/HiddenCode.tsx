import React from "react";
import { Copy, Eye, EyeOff } from "react-feather";

// exact length of a uuidv4
const DEFAULT_PLACEHOLDER = "************************************";

export default function HiddenCode({
  code,
  placeholder
}: {
  code: string;
  placeholder?: string;
}) {
  const [hidden, setHidden] = React.useState(true);
  const [copyClicked, setCopyClicked] = React.useState(false);
  const ButtonElem = hidden ? EyeOff : Eye;

  const placeholderToUse = placeholder ?? DEFAULT_PLACEHOLDER;

  return (
    <div className="authKey">
      <ButtonElem onClick={() => setHidden(!hidden)} />

      <Copy
        className={copyClicked ? "copyClicked" : ""}
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopyClicked(true);

          setTimeout(() => {
            setCopyClicked(false);
          }, 500);
        }}
      />
      <code>{hidden ? placeholderToUse : code}</code>
    </div>
  );
}
