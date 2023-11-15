import React from "react";

type LoginResponse = {
  username: string;
  id: string;
  key: string;
};

type RedirectState =
  | {
      error: true;
      errorMessage: string;
    }
  | {
      error: false;
      username: string;
      id: string;
      key: string;
    };

export default function Redirect() {
  const [state, setState] = React.useState<RedirectState | null>(null);
  const [keyHidden, setKeyHidden] = React.useState(true);

  React.useEffect(() => {
    async function run() {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");
      const state = query.get("state");
      if (state != localStorage.getItem("state")) {
        setState({
          error: true,
          errorMessage: "State mismatch."
        });
        return;
      }

      if (code == null) {
        setState({
          error: true,
          errorMessage: "No code provided."
        });
        return;
      }

      try {
        const req = await fetch(
          `${import.meta.env.VITE_SLOP_CREW_SERVER}api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Origin: window.location.origin
            },
            body: JSON.stringify({
              code
            })
          }
        );

        if (!req.ok) {
          setState({
            error: true,
            errorMessage: `Error making request to server: ${req.status} ${req.statusText}`
          });
          return;
        }

        const json = (await req.json()) as LoginResponse;
        setState({
          error: false,
          username: json.username,
          id: json.id,
          key: json.key
        });
      } catch (e) {
        setState({
          error: true,
          errorMessage: `Error making request to server: ${e}`
        });
        return;
      }
    }

    run();
  }, []);

  if (state == null) {
    return <p>One second...</p>;
  } else if (state.error) {
    return (
      <>
        <p>Something went wrong logging in. Sorry! Please report this.</p>
        <p>{state.errorMessage}</p>
      </>
    );
  } else {
    return (
      <div>
        <p>
          Logged in as {state.username} ({state.id}).
        </p>

        <p>
          Enter this key into your Slop Crew config file. This should never be
          shared with anyone!
        </p>

        <button onClick={() => setKeyHidden(!keyHidden)}>
          {keyHidden ? "Show" : "Hide"} key
        </button>

        <br />

        <span>
          {keyHidden ? (
            <code>************************************</code>
          ) : (
            <code>{state.key}</code>
          )}
        </span>
      </div>
    );
  }
}
