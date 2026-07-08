export function SceneStep({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary">
      {children}
    </span>
  );
}

export function PipelineRow({ label, lit = false }: { label: string; lit?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${lit ? 'bg-accent-green' : 'bg-muted-foreground/30'}`}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function StatTile({
  value,
  label,
  suffix = '',
  accent = 'primary',
}: {
  value: number;
  label: string;
  suffix?: string;
  accent?: 'primary' | 'violet' | 'green';
}) {
  const color =
    accent === 'violet'
      ? 'text-accent-violet'
      : accent === 'green'
        ? 'text-accent-green'
        : 'text-primary';
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
      <div className={`font-display text-4xl font-bold md:text-5xl ${color}`}>
        <span data-count-to={value} data-count-suffix={suffix}>
          0{suffix}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
