import { useAuthStore } from "../stores";

export default function Index() {
  const genNewState = useAuthStore((state) => state.genNewState);

  function doTheThing() {
    const state = genNewState();
    const query = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
      response_type: "code",
      scope: "identify",
      state
    });

    const redirectUri = new URL("https://discord.com/api/oauth2/authorize");
    redirectUri.search = query.toString();
    window.location.href = redirectUri.toString();
  }

  return (
    <>
      <hgroup>
        <h1>Link</h1>
        <h3>Sign in and connect to Slop Crew</h3>
      </hgroup>

      <p>
        After signing in with Discord, an authentication key will be generated
        that can be input into your Slop Crew config file. Signing in will reset
        all previous authentication keys.
      </p>

      <a href="#" role="button" onClick={doTheThing}>
        Sign in with Discord
      </a>
    </>
  );
}
