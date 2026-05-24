import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn('max-w-3xl space-y-4', className)}>
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">{label}</p>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
      ) : null}
    </header>
  );
}
