export type MeResponse = {
  username: string;
  id: string;
  avatar: string | null;
};

export type AuthResponse = MeResponse & {
  key: string;
};
