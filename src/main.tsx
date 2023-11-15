import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import Redirect from "./Redirect.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/redirect",
    element: <Redirect />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
