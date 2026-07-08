import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface FrontMatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  coverImage?: string;
  language: 'en' | 'de';
  slug: string;
}

export interface BlogPost extends FrontMatter {
  content: string;
}

export async function getMDXContent(slug: string, locale: string) {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog', locale);
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(source);
    const frontMatter = data as FrontMatter;

    return {
      frontMatter: {
        ...frontMatter,
        slug,
        language: locale as 'en' | 'de',
      },
      content,
    };
  } catch (error) {
    if (locale !== 'en') {
      return getMDXContent(slug, 'en');
    }
    throw error;
  }
}

export async function getAllPosts(locale: string = 'en'): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog', locale);

  try {
    const files = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx'))
        .map(async file => {
          const source = await fs.readFile(path.join(postsDirectory, file), 'utf8');
          const { data, content } = matter(source);
          const slug = file.replace(/\.mdx$/, '');

          return {
            ...data,
            slug,
            language: locale,
            content,
          } as BlogPost;
        })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error loading posts for locale ${locale}:`, error);
    return [];
  }
}
