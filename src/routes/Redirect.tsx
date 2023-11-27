import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { AuthResponse } from "../api/types";

type ExchangeResult =
  | {
      error: true;
      errorMessage: string;
    }
  | {
      error: false;
    };

export default function Redirect() {
  const navigate = useNavigate();
  const storeState = useAuthStore((state) => state.state);
  const setKey = useAuthStore((state) => state.setKey);
  const [result, setResult] = React.useState<ExchangeResult | null>(null);

  React.useEffect(() => {
    async function run() {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");
      const state = query.get("state");
      if (state != storeState) {
        setResult({
          error: true,
          errorMessage: "State mismatch."
        });
        return;
      }

      try {
        const req = await fetch(
          `${import.meta.env.VITE_SLOP_CREW_SERVER}api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              code
            })
          }
        );

        if (!req.ok) {
          setResult({
            error: true,
            errorMessage: `Error making request to server: ${req.status} ${req.statusText}`
          });
          return;
        }

        const json = (await req.json()) as AuthResponse;
        setKey(json.key);
        setResult({ error: false });
      } catch (e) {
        setResult({
          error: true,
          errorMessage: `Error making request to server: ${e}`
        });
        return;
      }
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (result != null && !result.error) {
    navigate("/settings");
  }

  return result == null ? (
    <span aria-busy="true">One second...</span>
  ) : result.error ? (
    <>
      <p>
        Something went wrong while trying to sign in. Please try again, or let
        us know if it continues to happen.
      </p>

      <code>{result.errorMessage}</code>
    </>
  ) : (
    <span aria-busy="true">Signed in succesfully. One second...</span>
  );
}
