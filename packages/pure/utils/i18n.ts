import type { CollectionEntry } from 'astro:content'

export const defaultLocale = 'zh'
export const supportedLocales = ['zh', 'en'] as const

export type SupportedLocale = (typeof supportedLocales)[number]

export const ui = {
  zh: {
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
    code: 'ZH',
    switchCode: 'EN',
    switchLanguageTitle: 'Switch to English',
    nav: {
      Blog: 'Blog',
      Projects: 'Projects',
      Links: 'Links',
      About: 'About',
      Search: 'Search'
    },
    categories: {
      Research: 'Research',
      Technical: 'Technical',
      Daily: 'Daily',
      Essays: 'Essays'
    },
    common: {
      back: 'Back'
    },
    blog: {
      title: 'Blog',
      description: 'Some posts or archives of my blog',
      noPosts: 'No posts yet.',
      pageStatus: (page: number, shown: number, total: number) =>
        `Page ${page} - Showing ${shown} of ${total} posts`,
      archives: 'View all posts by years',
      tags: 'Tags',
      viewAll: 'View all',
      prevPosts: '<- Previous Posts',
      nextPosts: 'Next Posts ->',
      prev: 'Previous',
      next: 'Next',
      tagTitle: (tag: string) => `Tag: ${tag}`,
      tagDescription: (tag: string) => `View all posts with the tag - ${tag}`,
      categoryDescription: (category: string) => `Posts in category: ${category}`
    },
    home: {
      title: 'Home',
      about: 'About',
      posts: 'Posts',
      education: 'Education',
      statistics: 'Statistics',
      skills: 'Skills',
      moreAbout: 'More about me',
      morePosts: 'More posts'
    },
    archives: {
      title: 'Archives',
      description: 'A list of all the years of creating my posts',
      postSingular: 'post',
      postPlural: 'posts'
    },
    search: {
      title: 'Search',
      description: 'Search relative posts of the whole blog',
      prompt: 'Enter a search term or phrase to search the blog.',
      disabled: 'Pagefind is disabled.'
    },
    tagsPage: {
      title: 'Tags',
      description: "A list of all the topics I've written about in my posts",
      empty: 'Any tag yet.'
    }
  },
  en: {
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    code: 'EN',
    switchCode: 'ZH',
    switchLanguageTitle: 'Switch to Chinese',
    nav: {
      Blog: 'Blog',
      Projects: 'Projects',
      Links: 'Links',
      About: 'About',
      Search: 'Search'
    },
    categories: {
      Research: 'Research',
      Technical: 'Technical',
      Daily: 'Daily',
      Essays: 'Essays'
    },
    common: {
      back: 'Back'
    },
    blog: {
      title: 'Blog',
      description: 'Posts and archives from my blog',
      noPosts: 'No posts yet.',
      pageStatus: (page: number, shown: number, total: number) =>
        `Page ${page} - Showing ${shown} of ${total} posts`,
      archives: 'View all posts by year',
      tags: 'Tags',
      viewAll: 'View all',
      prevPosts: '<- Previous Posts',
      nextPosts: 'Next Posts ->',
      prev: 'Previous',
      next: 'Next',
      tagTitle: (tag: string) => `Tag: ${tag}`,
      tagDescription: (tag: string) => `View all posts with the tag ${tag}`,
      categoryDescription: (category: string) => `Posts in category: ${category}`
    },
    home: {
      title: 'Home',
      about: 'About',
      posts: 'Posts',
      education: 'Education',
      statistics: 'Statistics',
      skills: 'Skills',
      moreAbout: 'More about me',
      morePosts: 'More posts'
    },
    archives: {
      title: 'Archives',
      description: 'A list of all posts grouped by year',
      postSingular: 'post',
      postPlural: 'posts'
    },
    search: {
      title: 'Search',
      description: 'Search related posts across the whole blog',
      prompt: 'Enter a search term or phrase to search the blog.',
      disabled: 'Pagefind is disabled.'
    },
    tagsPage: {
      title: 'Tags',
      description: "A list of all the topics I've written about in my posts",
      empty: 'No tags yet.'
    }
  }
} as const

type BlogPost = CollectionEntry<'blog'>
type BlogPostData = BlogPost['data'] & {
  lang?: string
  slug?: string
  translationKey?: string
  language?: string
}

export function isSupportedLocale(locale: string | undefined): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

export function getLocaleFromPathname(pathname: string): SupportedLocale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : defaultLocale
}

export function getAlternateLocale(locale: SupportedLocale): SupportedLocale {
  return locale === 'en' ? 'zh' : 'en'
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname || '/'
  if (normalized === '/en') return '/'
  if (normalized.startsWith('/en/')) return normalized.slice(3) || '/'
  return normalized
}

export function withLocale(pathname: string, locale: SupportedLocale): string {
  const path = stripLocalePrefix(pathname.startsWith('/') ? pathname : `/${pathname}`)
  if (locale === defaultLocale) return path
  return path === '/' ? '/en' : `/en${path}`
}

export function getContentLocale(data: BlogPostData): SupportedLocale {
  if (isSupportedLocale(data.lang)) return data.lang
  if (data.language?.toLowerCase().startsWith('en')) return 'en'
  return defaultLocale
}

export function getPostLocale(post: BlogPost): SupportedLocale {
  return getContentLocale(post.data as BlogPostData)
}

export function getPostsByLocale(posts: BlogPost[], locale: SupportedLocale): BlogPost[] {
  return posts.filter((post) => getPostLocale(post) === locale)
}

export function getPostSlug(post: BlogPost): string {
  const slug = (post.data as BlogPostData).slug || post.id
  return slug.replace(/^\/+|\/+$/g, '')
}

export function getPostPath(post: BlogPost): string {
  return withLocale(`/blog/${getPostSlug(post)}`, getPostLocale(post))
}

export function getBlogIndexPath(locale: SupportedLocale): string {
  return withLocale('/blog', locale)
}

export function getSearchPath(locale: SupportedLocale): string {
  return withLocale('/search', locale)
}

export function getArchivesPath(locale: SupportedLocale): string {
  return withLocale('/archives', locale)
}

export function getTagsIndexPath(locale: SupportedLocale): string {
  return withLocale('/tags', locale)
}

export function getTagPath(tag: string, locale: SupportedLocale): string {
  return withLocale(`/tags/${tag}`, locale)
}

export function getCategoryPath(category: string, locale: SupportedLocale): string {
  return withLocale(`/blog/category/${category}`, locale)
}

export function findTranslation(
  post: BlogPost,
  posts: BlogPost[],
  targetLocale: SupportedLocale
): BlogPost | undefined {
  const translationKey = (post.data as BlogPostData).translationKey
  if (!translationKey) return undefined
  return posts.find(
    (candidate) =>
      (candidate.data as BlogPostData).translationKey === translationKey &&
      getPostLocale(candidate) === targetLocale
  )
}

function getPostRouteSlug(pathname: string): string | undefined {
  const path = stripLocalePrefix(pathname)
  if (!path.startsWith('/blog/')) return undefined
  if (path.startsWith('/blog/category/')) return undefined
  return decodeURI(path.slice('/blog/'.length).replace(/^\/+|\/+$/g, ''))
}

export function findPostByRoute(
  pathname: string,
  posts: BlogPost[],
  locale = getLocaleFromPathname(pathname)
): BlogPost | undefined {
  const slug = getPostRouteSlug(pathname)
  if (!slug) return undefined
  return posts.find((post) => getPostLocale(post) === locale && getPostSlug(post) === slug)
}

export function getLanguageSwitchHref(pathname: string, posts: BlogPost[] = []): string {
  const currentLocale = getLocaleFromPathname(pathname)
  const targetLocale = getAlternateLocale(currentLocale)
  const currentPost = findPostByRoute(pathname, posts, currentLocale)
  const translation = currentPost && findTranslation(currentPost, posts, targetLocale)
  if (translation) return getPostPath(translation)
  if (currentPost) return getBlogIndexPath(targetLocale)
  return withLocale(pathname, targetLocale)
}
