import { useAuthStore } from "../stores";
import { useNavigate } from "react-router-dom";
import HiddenCode from "../components/HiddenCode";

export default function Settings() {
  const key = useAuthStore((state) => state.key);

  const navigate = useNavigate();
  if (key == null) {
    navigate("/link");
    return <></>;
  }

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

        <HiddenCode code={key} />
      </section>
    </>
  );
}
