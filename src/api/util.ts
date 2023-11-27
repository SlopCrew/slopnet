import { Result } from "./types";

export async function tryFetch(
  input: string,
  info: RequestInit
): Promise<Result<Response, string>> {
  let req;
  try {
    req = await fetch(input, info);
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      return { ok: false, error: e.message };
    } else {
      return { ok: false, error: "Unknown error" };
    }
  }

  if (!req.ok) {
    const text = await req.text();
    if (text == "") {
      return {
        ok: false,
        error: `Unknown error: ${req.status} ${req.statusText}`
      };
    } else {
      return { ok: false, error: text };
    }
  }

  return {
    ok: true,
    value: req
  };
}
