'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Twitter, Linkedin, Link, Check, Share2 } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const t = useTranslations('blog');
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{t('share')}</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-3 rounded-xl bg-gradient-to-br from-blue-700/10 to-blue-800/5 border border-blue-700/20 hover:border-blue-700/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20 hover:scale-105"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4 text-blue-700 group-hover:text-blue-600 transition-colors" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        <button
          onClick={copyToClipboard}
          className={`group relative p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
            copied
              ? 'bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/40 shadow-lg shadow-green-500/20'
              : 'bg-gradient-to-br from-muted/50 to-muted/30 border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'
          }`}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent" />
            </>
          ) : (
            <>
              <Link className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
