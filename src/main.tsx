import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import "@picocss/pico/css/pico.min.css";

import Root from "./App.tsx";
import ErrorPage from "./routes/Error.tsx";
import _404 from "./routes/404.tsx";

import Index from "./routes/Index.tsx";
import Link from "./routes/Link.tsx";
import Redirect from "./routes/Redirect.tsx";
import Settings from "./routes/Settings.tsx";

import Crews from "./routes/crews/Crews.tsx";
import CrewsCreate from "./routes/crews/Create.tsx";
import Crew from "./routes/crews/Crew.tsx";
import CrewSettings from "./routes/crews/CrewSettings.tsx";

import {
  crewsLoader,
  crewLoader,
  crewSettingsLoader
} from "./routes/loaders.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />
      },

      {
        path: "link",
        element: <Link />
      },
      {
        path: "redirect",
        element: <Redirect />
      },
      {
        path: "settings",
        element: <Settings />
      },

      {
        path: "crews",
        loader: crewsLoader,
        element: <Crews />
      },
      {
        path: "crews/create",
        element: <CrewsCreate />
      },
      {
        path: "crews/:id",
        loader: crewLoader,
        element: <Crew />
      },
      {
        path: "crews/:id/settings",
        loader: crewSettingsLoader,
        element: <CrewSettings />
      },

      {
        path: "*",
        element: <_404 />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
