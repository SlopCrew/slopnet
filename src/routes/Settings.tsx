import { useAuthStore } from "../stores";
import { useNavigate } from "react-router-dom";
import HiddenCode from "../components/HiddenCode";
import { settingsLoader } from "./loaders";
import { Await, useLoaderData } from "react-router-typesafe";
import { SimpleCrewResponse } from "../api/types";
import React from "react";
import { setRepresentingCrew } from "../api/crew";

function CrewInner({
  authKey,
  crews,
  representingCrew
}: {
  authKey: string;
  crews: SimpleCrewResponse[];
  representingCrew: string | null;
}) {
  return (
    <>
      <h1>Settings</h1>

      <section className="smolPadding">
        <h2>Authentication key</h2>

        <p>
          Insert this into your Slop Crew config file to authenticate with
          SlopNet in game. Never share this with anyone. Slop Crew developers
          will never ask for your auth token.
        </p>

        <HiddenCode code={authKey} />
      </section>

      <section className="smolPadding">
        <h2>Representing crew</h2>

        <p>
          Pick a crew to represent in game. Their tag will appear above your
          nameplate.
        </p>

        <select
          defaultValue={representingCrew ?? ""}
          onChange={async (e) => {
            console.log(e.target.value);
            let crewId: string | null = e.target.value;
            if (crewId == "") crewId = null;
            await setRepresentingCrew(crewId);
          }}
        >
          <option value="">Run solo</option>

          {crews.map((crew) => (
            <option key={crew.id} value={crew.id}>
              {crew.name}
            </option>
          ))}
        </select>
      </section>
    </>
  );
}

export default function Settings() {
  const key = useAuthStore((state) => state.key);
  const navigate = useNavigate();
  const data = useLoaderData<typeof settingsLoader>();
  const dataPromise = Promise.all([data.crews, data.representingCrew]);

  if (key == null) {
    navigate("/link");
    return <></>;
  }

  return (
    <React.Suspense
      fallback={<span aria-busy="true">Loading your settings...</span>}
    >
      <Await
        resolve={dataPromise}
        errorElement={<span>Failed to load settings.</span>}
      >
        {([crews, representingCrew]) => {
          return (
            <CrewInner
              authKey={key}
              crews={crews}
              representingCrew={representingCrew}
            />
          );
        }}
      </Await>
    </React.Suspense>
  );
}
