import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

/**
 * A slim, human reassurance band before the outro — no stack chips, no
 * engineering framing. One calm sentence: your club, your data.
 */
export function TrustScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section className="relative px-4 pt-8 pb-4">
      <div
        data-fade
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center backdrop-blur-md"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-accent-violet/[0.12]">
          <ShieldCheck className="h-5 w-5 text-accent-violet" />
        </span>
        <p className="max-w-xl text-lg font-medium text-foreground md:text-xl">
          {td('trust.line')}
        </p>
      </div>
    </section>
  );
}
