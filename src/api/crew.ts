import { useAuthStore } from "../stores";
import { CrewResponse, Result, SimpleCrewResponse } from "./types";
import { tryFetch } from "./util";

export async function getCrews() {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await fetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/crews`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  const res: SimpleCrewResponse[] = await req.json();
  return res;
}

export async function getCrew(id: string) {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await fetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${id}`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  const res: CrewResponse = await req.json();
  return res;
}

export async function create(
  name: string,
  tag: string
): Promise<Result<SimpleCrewResponse, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return {
      ok: false,
      error: "You must be logged in to create a crew"
    };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        name,
        tag
      })
    }
  );

  if (!req.ok) return req;
  const res: SimpleCrewResponse = await req.value.json();
  return { ok: true, value: res };
}

export async function promote(
  crew: string,
  user: string
): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return {
      ok: false,
      error: "You must be logged in to promote a user"
    };
  }

  const req = await tryFetch(
    `${
      import.meta.env.VITE_SLOP_CREW_SERVER
    }api/crew/${crew}/promote?id=${user}`,
    {
      method: "POST",
      headers: {
        Authorization: token
      }
    }
  );
  if (!req.ok) return req;
  return { ok: true, value: null };
}

export async function join(
  code: string
): Promise<Result<SimpleCrewResponse, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return {
      ok: false,
      error: "You must be logged in to join a crew"
    };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/join?code=${code}`,
    {
      method: "POST",
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return req;
  const res: SimpleCrewResponse = await req.value.json();
  return { ok: true, value: res };
}
