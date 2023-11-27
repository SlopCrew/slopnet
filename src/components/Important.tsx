export default function Important({
  type,
  message
}: {
  type: "danger" | "warning";
  message: string;
}) {
  return (
    <article className={`important ${type}`}>
      <p>{message}</p>
    </article>
  );
}
