import { Link } from "react-router-dom";

export default function _404() {
  return (
    <>
      <hgroup>
        <h1>404</h1>
        <h3>Not found</h3>
      </hgroup>

      <p>
        Whatever you're looking for doesn't exist; maybe it did at one point.
        Sorry about that. You can click <Link to="/">here</Link> to go to the
        home page.
      </p>
    </>
  );
}
