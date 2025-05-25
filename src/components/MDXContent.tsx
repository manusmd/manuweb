import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '../../mdx-components';

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  const components = useMDXComponents({});

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      }}
    />
  );
}
