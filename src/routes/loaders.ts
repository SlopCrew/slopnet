import { defer } from "react-router-typesafe";
import { getCrew, getCrews } from "../api/crew";
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
