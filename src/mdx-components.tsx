import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import { CopyButton } from '@/components/CopyButton';
import { Callout } from '@/components/blog/Callout';
import Link from 'next/link';
import Image from 'next/image';

interface CustomImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

function CustomImage({ src = '', alt = '', ...props }: CustomImageProps) {
  const isHeroImage = alt?.toLowerCase().includes('title') || src?.includes('title');
  
  return (
    <>
      <br />
      <div className="not-prose my-8">
        <div className="relative w-full h-[300px]">
          <Image 
            src={src} 
            alt={alt} 
            fill 
            className="object-cover rounded-lg" 
            priority={isHeroImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            {...props} 
          />
        </div>
        {alt && <p className="text-center text-sm text-muted-foreground mt-2">{alt}</p>}
      </div>
      <br />
    </>
  );
}

export const MDXComponents: MDXComponentsType = {
  a: ({ href = '', ...props }) => {
    if (href.startsWith('http')) {
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
    }
    return <Link href={href} {...props} />;
  },
  img: CustomImage,
  pre: ({ children, ...props }) => {
    return (
      <div className="relative group">
        <CopyButton content={children as string} />
        <pre {...props}>{children}</pre>
      </div>
    );
  },
  Callout,
};
