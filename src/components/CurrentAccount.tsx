import React from "react";
import { useAuthStore } from "../stores";
import { getMe } from "../api/auth";
import { Link } from "react-router-dom";

export default function CurrentAccount() {
  const token = useAuthStore((state) => state.key);
  const cachedMe = useAuthStore((state) => state.cachedMe);
  const setCachedMe = useAuthStore((state) => state.setCachedMe);

  React.useEffect(() => {
    async function validateToken() {
      const me = await getMe();
      setCachedMe(me);
    }

    if (token != null) validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return cachedMe != null ? (
    <li>
      <details role="list">
        <summary aria-haspopup="listbox" role="link" className="currentAccount">
          {cachedMe.avatar != null && (
            <img
              src={`https://cdn.discordapp.com/avatars/${cachedMe.id}/${cachedMe.avatar}.png`}
              alt={cachedMe.username}
            />
          )}

          {cachedMe.username}
        </summary>

        <ul role="listbox">
          <li>
            <Link to="/settings">Settings</Link>
          </li>

          <li>
            <a
              href="#"
              onClick={() => {
                setCachedMe(null);
              }}
            >
              Log out
            </a>
          </li>
        </ul>
      </details>
    </li>
  ) : (
    <li>
      <Link to="/link">Sign in</Link>
    </li>
  );
}
