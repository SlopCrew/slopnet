import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorWrapper({
  header,
  subheader,
  context
}: {
  header: string;
  subheader: string;
  context: string | null;
}) {
  return (
    <>
      <hgroup>
        <h1>{header}</h1>
        <h3>{subheader}</h3>
      </hgroup>

      <p>
        Sorry about that - things happen. Please report this bug - telling us
        what you were doing, and a screenshot of this page, helps a lot.
      </p>

      {context != null && <code>{context}</code>}
    </>
  );
}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorWrapper
        header={error.status.toString()}
        subheader={error.statusText}
        context={error.data.toString()}
      />
    );
  } else if (error instanceof Error) {
    return (
      <ErrorWrapper
        header={error.name}
        subheader={error.message}
        context={error.stack ?? "No stack trace available."}
      />
    );
  } else {
    return (
      <ErrorWrapper
        header="Unknown error"
        subheader="An unknown error occured."
        context={error?.toString() ?? null}
      />
    );
  }
}
