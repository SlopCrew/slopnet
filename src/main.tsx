import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import "@picocss/pico/css/pico.min.css";

import Root from "./App.tsx";
import ErrorPage from "./routes/Error.tsx";
import Index from "./routes/Index.tsx";
import Link from "./routes/Link.tsx";
import Redirect from "./routes/Redirect.tsx";
import Settings from "./routes/Settings.tsx";

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
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
