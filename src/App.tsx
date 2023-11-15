import "./App.css";

function genState() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < 32; i++) {
    state += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return state;
}
export default function App() {
  const state = genState();
  localStorage.setItem("state", state);

  const redirectUri = new URL("https://discord.com/api/oauth2/authorize");
  const query = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify",
    state
  });
  redirectUri.search = query.toString();

  return (
    <>
      <h1>SlopNet</h1>
      <p>
        This website will let you connect your Discord account to Slop Crew.
        While this is a currently unused feature, it will be used in the future.
      </p>
      <p>Click the button below to sign in:</p>
      <a href={redirectUri.toString()}>
        <button>Sign in with Discord</button>
      </a>
    </>
  );
}
