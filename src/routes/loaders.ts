import { defer } from "react-router-typesafe";
import {
  getCrew,
  getCrews,
  getInvites,
  getRepresentingCrew
} from "../api/crew";
import { CrewResponse, SimpleCrewResponse } from "../api/types";
import { Params } from "react-router-dom";

export type CrewsLoaderData = {
  crews: Promise<SimpleCrewResponse[]>;
};

export async function crewsLoader() {
  return defer<CrewsLoaderData>({
    crews: getCrews().then((res) => res ?? [])
  });
}

export type CrewLoaderData = {
  crew: Promise<CrewResponse | null>;
};

export async function crewLoader({ params }: { params: Params<"id"> }) {
  if (params.id == null) throw new Response("Not Found", { status: 404 });

  return defer<CrewLoaderData>({
    crew: getCrew(params.id)
  });
}

export type CrewSettingsLoaderData = {
  crew: Promise<CrewResponse | null>;
  invites: Promise<string[]>;
};

export async function crewSettingsLoader({ params }: { params: Params<"id"> }) {
  if (params.id == null) throw new Response("Not Found", { status: 404 });

  return defer<CrewSettingsLoaderData>({
    crew: getCrew(params.id),
    invites: getInvites(params.id)
  });
}

export type SettingsLoaderData = {
  crews: Promise<SimpleCrewResponse[]>;
  representingCrew: Promise<string | null>;
};

export async function settingsLoader() {
  return defer<SettingsLoaderData>({
    crews: getCrews().then((res) => res ?? []),
    representingCrew: getRepresentingCrew()
  });
}
