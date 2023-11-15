/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_DISCORD_REDIRECT_URI: string;
  readonly VITE_SLOP_CREW_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
