'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  content: string;
}

export function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-background/80 border border-border hover:bg-background transition-all duration-200 opacity-0 group-hover:opacity-100"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
}
