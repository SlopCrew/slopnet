import { Await, useLoaderData } from "react-router-typesafe";
import { crewLoader } from "../loaders";
import React from "react";
import { Link, useNavigate, useRevalidator } from "react-router-dom";
import FakeTMP from "../../components/FakeTMP";
import { CrewMember, CrewResponse } from "../../api/types";
import { useAuthStore } from "../../stores";
import Avatar from "../../components/Avatar";
import { useRequiredAuth } from "../../util";
import { demote, kick, leave, promote } from "../../api/crew";

function MembersActions({
  crew,
  me,
  member
}: {
  crew: CrewResponse;
  me?: CrewMember;
  member: CrewMember;
}) {
  const revalidator = useRevalidator();

  if (me?.id == member.id) {
    return <td></td>;
  }

  const canManageRank = crew.super_owner == me?.id;

  return (
    <td className="buttonGallery">
      {canManageRank &&
        (member.owner ? (
          <button
            onClick={async () => {
              const req = await demote(crew.id, member.id);
              if (req.ok) revalidator.revalidate();
            }}
            className="normalWidthButton danger"
          >
            Demote
          </button>
        ) : (
          <button
            onClick={async () => {
              const req = await promote(crew.id, member.id);
              if (req.ok) revalidator.revalidate();
            }}
            className="normalWidthButton warning"
          >
            Promote
          </button>
        ))}

      {!member.owner && (
        <button
          onClick={async () => {
            const req = await kick(crew.id, member.id);
            if (req.ok) revalidator.revalidate();
          }}
          className="normalWidthButton danger"
        >
          Kick
        </button>
      )}
    </td>
  );
}

function MembersTable({
  crew,
  me,
  members
}: {
  crew: CrewResponse;
  me?: CrewMember;
  members: CrewMember[];
}) {
  const isOwner = me?.owner == true;

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">User</th>
          {isOwner && <th scope="col">Actions</th>}
        </tr>
      </thead>

      <tbody>
        {members.map((member) => {
          return (
            <tr key={member.id}>
              <td className="crewAvatar">
                <Avatar person={member} />
                {member.owner ? (
                  <strong data-tooltip="Group owner">{member.username}</strong>
                ) : (
                  <span>{member.username}</span>
                )}
              </td>

              {isOwner && (
                <MembersActions crew={crew} me={me} member={member} />
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function LeaveCrewButton({
  crew,
  me
}: {
  crew: CrewResponse;
  me?: CrewMember;
}) {
  const navigate = useNavigate();

  const owners = crew.members.filter((x) => x.owner);

  // This is implemented serverside as well
  const canLeaveMemberClause = me != null && crew.members.length > 1;
  const canLeaveOwnersClause = me != null && (owners.length > 1 || !me.owner);
  const canLeaveSuperOwnerClause = me != null && crew.super_owner != me.id;
  const canLeave =
    canLeaveMemberClause && canLeaveOwnersClause && canLeaveSuperOwnerClause;

  let tooltip = "";
  if (!canLeaveMemberClause) {
    tooltip = "You're the only member of this crew.";
  }

  if (!canLeaveOwnersClause) {
    tooltip = "You're the only owner of this crew.";
  }

  if (!canLeaveSuperOwnerClause) {
    tooltip = "You're the creator of this crew.";
  }

  return (
    <div
      className="tooltipHack"
      data-tooltip={tooltip === "" ? null : tooltip}
      data-placement="right"
    >
      <button
        onClick={async () => {
          const req = await leave(crew.id);
          if (req.ok) navigate("/crews");
        }}
        role="button"
        className="normalWidthButton danger"
        disabled={!canLeave}
      >
        Leave
      </button>
    </div>
  );
}

function CrewInner({ crew }: { crew: CrewResponse }) {
  const cachedMe = useAuthStore((state) => state.cachedMe);
  const me = crew.members.find((x) => x.id === cachedMe?.id);
  const members = crew.members.sort((a, b) => {
    // owners go first
    if (a.owner && !b.owner) return -1;
    if (!a.owner && b.owner) return 1;

    // fallback to name
    return a.username.localeCompare(b.username);
  });

  return (
    <>
      <hgroup>
        <h1>{crew.name}</h1>
        <h3>
          <FakeTMP text={crew.tag} />
        </h3>
      </hgroup>

      <section className="smolPadding buttonGallery">
        <h2>Actions</h2>

        {me?.owner && (
          <Link to={`/crews/${crew.id}/settings`} role="button">
            Settings
          </Link>
        )}

        <LeaveCrewButton crew={crew} me={me} />
      </section>

      <section className="smolPadding">
        <h2>Members</h2>
        <MembersTable crew={crew} me={me} members={members} />
      </section>
    </>
  );
}

export default function Crew() {
  const data = useLoaderData<typeof crewLoader>();
  const navigate = useNavigate();
  useRequiredAuth();

  return (
    <React.Suspense
      fallback={<span aria-busy="true">Loading this crew...</span>}
    >
      <Await
        resolve={data.crew}
        errorElement={<span>Failed to load crew.</span>}
      >
        {(crew) => {
          if (crew == null) {
            navigate("/404");
            return <></>;
          }

          return <CrewInner crew={crew} />;
        }}
      </Await>
    </React.Suspense>
  );
}
