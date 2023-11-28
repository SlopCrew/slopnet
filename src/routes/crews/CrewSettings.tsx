import { Await, useLoaderData } from "react-router-typesafe";
import { crewSettingsLoader } from "../loaders";
import React from "react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { CrewResponse } from "../../api/types";
import HiddenCode from "../../components/HiddenCode";
import { useRequiredAuth } from "../../util";
import { createInvite, deleteInvite, nukeItFromOrbit } from "../../api/crew";

function CrewSettingsInner({
  crew,
  invites
}: {
  crew: CrewResponse;
  invites: string[];
}) {
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  return (
    <>
      <h1>Crew settings</h1>

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

      <section className="smolPadding">
        <h2>Super ultra danger zone</h2>

        <p>
          Clicking the delete button will{" "}
          <strong>
            delete your crew instantly, irrevocably, without any way to undo it.
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

          if (crew.members.find((x) => x.id === me?.id)?.owner !== true) {
            navigate("/crews");
            return <></>;
          }

          return <CrewSettingsInner crew={crew} invites={invites} />;
        }}
      </Await>
    </React.Suspense>
  );
}
