import { Await, useLoaderData } from "react-router-typesafe";
import { crewsLoader } from "../loaders";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRequiredAuth } from "../../util";
import { join } from "../../api/crew";
import Important from "../../components/Important";

function CrewInviteCode() {
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <>
      {error != null && <Important type="danger" message={error} />}

      <div className="inviteCode">
        <input ref={inputRef} type="password" placeholder="Invite code" />
        <button
          onClick={async () => {
            const input = inputRef.current;
            if (input == null) return;

            setWorking(true);
            const res = await join(input.value);
            setWorking(false);

            if (res.ok) {
              navigate(`/crews/${res.value.id}`);
            } else {
              setError(res.error);
            }
          }}
          disabled={working}
          className="normalWidthButton"
        >
          Join
        </button>
      </div>
    </>
  );
}

export default function Crews() {
  const data = useLoaderData<typeof crewsLoader>();
  useRequiredAuth();

  return (
    <>
      <hgroup>
        <h1>Crews</h1>
        <h3>Form up together with your friends</h3>
      </hgroup>

      <br />

      <React.Suspense
        fallback={<span aria-busy="true">Loading your crews...</span>}
      >
        <Await
          resolve={data.crews}
          errorElement={<span>Failed to load crews.</span>}
        >
          {(crews) => (
            <>
              <section>
                <Link to="/crews/create" role="button">
                  Create a crew
                </Link>

                <br />
                <br />

                <CrewInviteCode />
              </section>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Tag</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {crews.map((crew) => (
                    <tr key={crew.id}>
                      <td>{crew.name}</td>
                      <td>{crew.tag}</td>
                      <td>
                        <a href={`/crews/${crew.id}`} role="button">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Await>
      </React.Suspense>
    </>
  );
}
