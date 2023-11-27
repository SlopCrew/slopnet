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
          <CurrentAccount />
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
