import { useAuthStore } from "../stores";
import { CrewResponse, Result, SimpleCrewResponse } from "./types";
import { tryFetch } from "./util";

export async function getCrews() {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/crews`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  const res: SimpleCrewResponse[] = await req.value.json();
  return res;
}

export async function getCrew(id: string) {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${id}`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  const res: CrewResponse = await req.value.json();
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

export async function update(
  crew: string,
  name: string,
  tag: string
): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return {
      ok: false,
      error: "You must be logged in to update a crew"
    };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}`,
    {
      method: "PATCH",
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
  return { ok: true, value: null };
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

export async function getInvites(crew: string): Promise<string[]> {
  const token = useAuthStore.getState().key;
  if (token == null) return [];

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}/invites`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return [];
  const res: string[] = await req.value.json();
  return res;
}

export async function createInvite(crew: string): Promise<string | null> {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}/invites`,
    {
      method: "POST",
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return null;
  return await req.value.text();
}

export async function deleteInvite(
  crew: string,
  invite: string
): Promise<boolean> {
  const token = useAuthStore.getState().key;
  if (token == null) return false;

  const req = await tryFetch(
    `${
      import.meta.env.VITE_SLOP_CREW_SERVER
    }api/crew/${crew}/invites/${invite}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    }
  );
  return req.ok;
}

export async function demote(
  crew: string,
  user: string
): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return {
      ok: false,
      error: "You must be logged in to demote a user"
    };
  }

  const req = await tryFetch(
    `${
      import.meta.env.VITE_SLOP_CREW_SERVER
    }api/crew/${crew}/demote?id=${user}`,
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

export async function kick(
  crew: string,
  user: string
): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return { ok: false, error: "You must be logged in to kick a user" };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}/kick?id=${user}`,
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

export async function leave(crew: string): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return { ok: false, error: "You must be logged in to leave a crew" };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}/leave`,
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

export async function nukeItFromOrbit(
  crew: string
): Promise<Result<null, string>> {
  const token = useAuthStore.getState().key;
  if (token == null) {
    return { ok: false, error: "You must be logged in to delete a crew" };
  }

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/${crew}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    }
  );

  if (!req.ok) return req;
  return { ok: true, value: null };
}

export async function getRepresentingCrew(): Promise<string | null> {
  const token = useAuthStore.getState().key;
  if (token == null) return null;

  const req = await tryFetch(
    `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/represent`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  console.log(req);
  if (!req.ok) return null;
  if (req.value.status === 204) return null;
  return await req.value.text();
}

export async function setRepresentingCrew(
  crew: string | null
): Promise<boolean> {
  const token = useAuthStore.getState().key;
  if (token == null) return false;

  let url = `${import.meta.env.VITE_SLOP_CREW_SERVER}api/crew/represent`;
  if (crew != null) url += `?id=${crew}`;

  const req = await tryFetch(url, {
    method: "POST",
    headers: {
      Authorization: token
    }
  });

  return req.ok;
}
