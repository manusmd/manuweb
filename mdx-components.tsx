import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';
import { CopyButton } from '@/components/CopyButton';
import { Callout } from '@/components/blog/Callout';
import { CodeBlock } from '@/components/blog/CodeBlock';

function createHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => {
      const id = typeof children === 'string' ? createHeadingId(children) : '';
      return (
        <h1
          id={id}
          className="text-4xl font-display font-bold mb-6 mt-8 text-foreground border-b border-border pb-4"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = typeof children === 'string' ? createHeadingId(children) : '';
      return (
        <h2
          id={id}
          className="text-3xl font-display font-semibold mb-4 mt-8 text-foreground"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = typeof children === 'string' ? createHeadingId(children) : '';
      return (
        <h3
          id={id}
          className="text-2xl font-display font-semibold mb-3 mt-6 text-foreground"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const id = typeof children === 'string' ? createHeadingId(children) : '';
      return (
        <h4
          id={id}
          className="text-xl font-display font-semibold mb-2 mt-4 text-foreground"
          {...props}
        >
          {children}
        </h4>
      );
    },
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7 text-muted-foreground" {...props}>
        {children}
      </p>
    ),
    a: ({ href = '', children, ...props }) => {
      const isExternal = href.startsWith('http');
      const linkClasses =
        'text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60 underline-offset-4';

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClasses} inline-flex items-center gap-1`}
            {...props}
          >
            {children}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        );
      }
      return (
        <Link href={href} className={linkClasses} {...props}>
          {children}
        </Link>
      );
    },
    img: ({ src = '', alt = '', ...props }) => {
      return (
        <span className="block my-8">
          <span className="block relative w-full h-[400px] rounded-lg overflow-hidden border border-border">
            <Image src={src} alt={alt} fill className="object-cover" {...props} />
          </span>
          {alt && (
            <span className="block text-sm text-muted-foreground text-center mt-2 italic">
              {alt}
            </span>
          )}
        </span>
      );
    },
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-primary pl-6 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 space-y-2 list-none" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 space-y-2 list-decimal list-inside ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="flex items-start gap-3 text-muted-foreground" {...props}>
        <span className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0"></span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    pre: ({ children, ...props }) => {
      const child = Array.isArray(children) ? children[0] : children;
      if (typeof child === 'object' && child && 'props' in child) {
        const { children: code, className } = child.props;
        return <CodeBlock className={className}>{code}</CodeBlock>;
      }

      return (
        <span className="block relative group my-6">
          <pre
            className="bg-muted border border-border rounded-lg p-4 overflow-x-auto text-sm leading-6 font-mono"
            {...props}
          >
            {children}
          </pre>
          <CopyButton content={typeof children === 'string' ? children : ''} />
        </span>
      );
    },
    code: ({ children, className, ...props }) => {
      if (className?.includes('language-')) {
        return <CodeBlock className={className}>{children as string}</CodeBlock>;
      }

      return (
        <code
          className="bg-muted px-2 py-1 rounded text-sm font-mono border border-border"
          {...props}
        >
          {children}
        </code>
      );
    },
    hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-muted-foreground" {...props}>
        {children}
      </em>
    ),
    table: ({ children, ...props }) => (
      <span className="block my-6 overflow-x-auto">
        <table className="w-full border-collapse border border-border rounded-lg" {...props}>
          {children}
        </table>
      </span>
    ),
    th: ({ children, ...props }) => (
      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    ),
    Callout,
    ...components,
  };
}
