const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)]+)\)/;

export function extractBlogCoverImage(content: string): string | null {
  const match = content.trim().match(MARKDOWN_IMAGE_REGEX);
  return match?.[1] ?? null;
}

export function resolveBlogCoverImage(post: {
  content: string;
  coverImage?: string;
  title: string;
}) {
  return post.coverImage ?? extractBlogCoverImage(post.content);
}
