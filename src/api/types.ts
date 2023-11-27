export type MeResponse = {
  username: string;
  id: string;
  avatar: string | null;
};

export type AuthResponse = MeResponse & {
  key: string;
};

export type SimpleCrewResponse = {
  id: string;
  name: string;
  tag: string;
};

export type CrewResponse = SimpleCrewResponse & {
  members: CrewMember[];
};

export type CrewMember = {
  id: string;
  username: string;
  owner: boolean;
  avatar: string | null;
};

export type Result<T, E> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };
