import { Link, Outlet } from "react-router-dom";
import CurrentAccount from "./components/CurrentAccount";

export default function Root() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/" className="contrast">
              <strong>SlopNet</strong>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link to="/crews">Crews</Link>
          </li>

          <CurrentAccount />
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
