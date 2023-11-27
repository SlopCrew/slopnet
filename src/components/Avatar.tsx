type HasAvatar = {
  id: string;
  avatar: string | null;
  username: string;
};

export default function Avatar({ person }: { person: HasAvatar }) {
  if (person.avatar == null) return <></>;

  return (
    <img
      className="avatar"
      src={`https://cdn.discordapp.com/avatars/${person.id}/${person.avatar}.png`}
      alt={person.username}
    />
  );
}
