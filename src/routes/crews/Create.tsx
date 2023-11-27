import React from "react";
import TMPInput from "../../components/TMPInput";
import { Link, useNavigate } from "react-router-dom";
import { create } from "../../api/crew";
import Important from "../../components/Important";

export default function Create() {
  const name = React.createRef<HTMLInputElement>();
  const tag = React.createRef<HTMLInputElement>();
  const navigate = useNavigate();

  const [swag, setSwag] = React.useState<boolean>(false);
  const [working, setWorking] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <>
      <h1>Create a crew</h1>

      {error != null && <Important type="danger" message={error} />}

      <input
        type="text"
        ref={name}
        placeholder="Crew name"
        minLength={3}
        maxLength={32}
      />

      <p>
        If you <Link to="/settings">represent this crew</Link>, its tag will
        appear above your nameplate. TextMeshPro color tags are supported. An
        approximate preview of how it will look in game will appear as you type.
      </p>

      <TMPInput ref={tag} placeholder="Crew tag" minLength={3} maxLength={32} />

      <input
        name="swag"
        type="checkbox"
        onChange={(e) => setSwag(e.target.checked)}
      />
      <label htmlFor="swag">
        I agree to be the best crew to ever go All City in New Amsterdam.
      </label>

      {/* why do i need two lmao */}
      <br />
      <br />

      <button
        disabled={!swag || working}
        onClick={async () => {
          const nameVal = name.current?.value;
          const tagVal = tag.current?.value;
          if (nameVal == null || tagVal == null) return;

          setWorking(true);
          setError(null);

          const req = await create(nameVal, tagVal);
          setWorking(false);

          if (!req.ok) {
            setError(req.error);
            return;
          } else {
            navigate(`/crews/${req.value.id}`);
          }
        }}
      >
        Create crew
      </button>
    </>
  );
}
