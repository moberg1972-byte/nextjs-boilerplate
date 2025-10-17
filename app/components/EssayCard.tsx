export function EssayCard({ title, payload }: { title?: string; payload: any }) {
  const text =
    payload?.markdown ??
    payload?.text ??
    payload?.body ??
    JSON.stringify(payload, null, 2);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{title ?? payload?.title ?? "Essay"}</h2>
      <div className="prose max-w-none text-zinc-800 whitespace-pre-wrap">{text}</div>
    </article>
  );
}
