import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./stores";
import React from "react";

export function useRequiredAuth() {
  const cachedMe = useAuthStore((state) => state.cachedMe);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (cachedMe == null) navigate("/link");
  }, [cachedMe, navigate]);

  return cachedMe;
}
