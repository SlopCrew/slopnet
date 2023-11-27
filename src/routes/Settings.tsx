import React from "react";
import { useAuthStore } from "../stores";
import { Eye, EyeOff, Copy } from "react-feather";

function AuthKey() {
  const key = useAuthStore((state) => state.key);
  const [hidden, setHidden] = React.useState(true);
  const [copyClicked, setCopyClicked] = React.useState(false);

  const ButtonElem = hidden ? EyeOff : Eye;

  if (key == null) return <p>Not logged in.</p>;

  return (
    <div className="authKey">
      <ButtonElem onClick={() => setHidden(!hidden)} />{" "}
      <Copy
        className={copyClicked ? "copyClicked" : ""}
        onClick={() => {
          navigator.clipboard.writeText(key);
          setCopyClicked(true);

          setTimeout(() => {
            setCopyClicked(false);
          }, 500);
        }}
      />
      <code>{hidden ? "************************************" : key}</code>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>

      <section>
        <h2>Authentication key</h2>

        <p>
          Insert this into your Slop Crew config file to authenticate with
          SlopNet in game. Never share this with anyone. Slop Crew developers
          will never ask for your auth token.
        </p>

        <AuthKey />
      </section>
    </>
  );
}
