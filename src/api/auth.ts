import { useAuthStore } from "../stores";
import { MeResponse } from "./types";

export async function getMe() {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await fetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/auth/me`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  const res: MeResponse = await req.json();
  return res;
}
