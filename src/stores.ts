import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MeResponse } from "./api/types";

function genState() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < 32; i++) {
    state += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return state;
}

export interface AuthStore {
  state: string | null;
  genNewState: () => string;

  key: string | null;
  setKey: (key: string) => void;

  cachedMe: MeResponse | null;
  setCachedMe: (me: MeResponse | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      state: null,
      genNewState: () => {
        const state = genState();
        set({ state });
        return state;
      },

      key: null,
      setKey: (key) => set({ key }),

      cachedMe: null,
      setCachedMe: (me) => {
        if (me == null) {
          set({ cachedMe: null, key: null });
        } else {
          set({ cachedMe: me });
        }
      }
    }),
    {
      name: "auth"
    }
  )
);
