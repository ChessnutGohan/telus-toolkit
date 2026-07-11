export default function PageHeader({
  code,
  title,
  lede,
}: {
  code: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-8 border-b border-line pb-6">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-relay">
        {code}
      </span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ivory">
        {title}
      </h1>
      {lede && <p className="mt-2 max-w-xl font-body text-sm text-muted">{lede}</p>}
    </div>
  );
}
