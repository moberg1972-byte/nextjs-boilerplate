// app/components/EssayCard.tsx
type EssayPayload = {
  title?: string | null;
  text?: string | null;      // common field name
  markdown?: string | null;  // if you store as markdown
  body?: string | null;      // fallback
  [k: string]: any;          // ignore extras
};

export function EssayCard({ title, payload }: { title?: string; payload: EssayPayload }) {
  const body =
    payload?.markdown ??
    payload?.text ??
    payload?.body ??
    JSON.stringify(payload, null, 2); // last resort

  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <header style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>{title ?? payload?.title ?? 'Essay'}</h2>
      </header>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.5 }}>
        {body}
      </pre>
    </article>
  );
}
