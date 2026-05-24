export function getBlogTagColor(tag: string) {
  const tagColors: Record<string, string> = {
    ai: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    coding: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    llm: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    programming: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    automation: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    ki: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    programmierung: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    automatisierung: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  };

  return tagColors[tag.toLowerCase()] ?? 'border-border/50 bg-muted/30 text-muted-foreground';
}

export function calculateReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
