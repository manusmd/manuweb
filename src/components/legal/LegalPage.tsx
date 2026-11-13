import type { ReactNode } from 'react';

export interface LegalSection {
  heading: string;
  body: string[];
}

const TOKEN = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/[^\s]+)/g;
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** Turn plain legal text into nodes, linkifying e-mail addresses and URLs. */
function linkify(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (EMAIL.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-primary hover:underline">
          {part}
        </a>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[.,)]+$/, '');
      return (
        <a
          key={i}
          href={clean}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words text-primary hover:underline"
        >
          {clean}
        </a>
      );
    }
    return part;
  });
}

/** Shared layout for the Impressum and Datenschutzerklärung pages. */
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {updated ? <p className="mt-3 text-sm text-muted-foreground">{updated}</p> : null}

        <div className="mt-10 space-y-10">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {linkify(paragraph)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
