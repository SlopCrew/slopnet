import { Await, useLoaderData } from "react-router-typesafe";
import { crewSettingsLoader } from "../loaders";
import React from "react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { CrewResponse, MeResponse } from "../../api/types";
import HiddenCode from "../../components/HiddenCode";
import { useRequiredAuth } from "../../util";
import {
  createInvite,
  deleteInvite,
  nukeItFromOrbit,
  update
} from "../../api/crew";
import TMPInput from "../../components/TMPInput.tsx";
import Important from "../../components/Important.tsx";

function CrewUpdate({ crew }: { crew: CrewResponse }) {
  const revalidator = useRevalidator();
  const name = React.createRef<HTMLInputElement>();
  const tag = React.createRef<HTMLInputElement>();

  const [working, setWorking] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <section className="smolPadding">
      <h2>Name & tag</h2>

      {error != null && <Important type="danger" message={error} />}

      <input
        type="text"
        ref={name}
        defaultValue={crew.name}
        placeholder="Crew name"
        minLength={3}
        maxLength={32}
      />

      <TMPInput
        ref={tag}
        defaultValue={crew.tag}
        placeholder="Crew tag"
        minLength={3}
        maxLength={32}
      />

      <button
        className="normalWidthButton"
        disabled={working}
        onClick={async () => {
          const nameVal = name.current?.value;
          const tagVal = tag.current?.value;
          if (nameVal == null || tagVal == null) return;

          setWorking(true);
          setError(null);

          const req = await update(crew.id, nameVal, tagVal);
          setWorking(false);

          if (!req.ok) {
            setError(req.error);
          } else {
            revalidator.revalidate();
          }
        }}
      >
        Update
      </button>
    </section>
  );
}

function CrewSettingsInner({
  crew,
  invites,
  me
}: {
  crew: CrewResponse;
  invites: string[];
  me: MeResponse;
}) {
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  return (
    <>
      <h1>Crew settings</h1>

      <CrewUpdate crew={crew} />

      <section className="smolPadding">
        <h2>Invites</h2>

        <button
          onClick={async () => {
            const invite = await createInvite(crew.id);
            if (invite != null) revalidator.revalidate();
          }}
          className="normalWidthButton"
        >
          Create invite
        </button>

        <table>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invites.map((invite) => {
              return (
                <tr key={invite}>
                  <td>
                    <HiddenCode code={invite} />
                  </td>

                  <td>
                    <button
                      onClick={async () => {
                        const worked = await deleteInvite(crew.id, invite);
                        if (worked) revalidator.revalidate();
                      }}
                      className="normalWidthButton danger"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {crew.super_owner == me.id && (
        <section className="smolPadding">
          <h2>Super ultra danger zone</h2>

          <p>
            Clicking the delete button will{" "}
            <strong>
              delete your crew instantly, irrevocably, without any way to undo
              it.
            </strong>{" "}
            Be careful!
          </p>

          <button
            onClick={async () => {
              const msg =
                "Are you *absolutely* sure you want to delete your crew? There's no going back!";
              if (window.confirm(msg)) {
                const req = await nukeItFromOrbit(crew.id);
                if (req.ok) navigate("/crews");
              }
            }}
            className="normalWidthButton danger"
          >
            Delete crew
          </button>
        </section>
      )}
    </>
  );
}

export default function CrewSettings() {
  const me = useRequiredAuth();
  const navigate = useNavigate();
  const data = useLoaderData<typeof crewSettingsLoader>();
  const dataPromise = Promise.all([data.crew, data.invites]);

  return (
    <React.Suspense
      fallback={<span aria-busy="true">Loading crew settings...</span>}
    >
      <Await
        resolve={dataPromise}
        errorElement={<span>Failed to load settings.</span>}
      >
        {([crew, invites]) => {
          if (crew == null) {
            navigate("/404");
            return <></>;
          }

          if (
            me == null ||
            crew.members.find((x) => x.id === me?.id)?.owner !== true
          ) {
            navigate("/crews");
            return <></>;
          }

          return <CrewSettingsInner crew={crew} invites={invites} me={me} />;
        }}
      </Await>
    </React.Suspense>
  );
}
