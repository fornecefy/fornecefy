import { supabase } from '../supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  category: string
  tags: string[]
  status: string
  published_at: string
  created_at: string
  seo_title?: string
  seo_description?: string
}

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error.message)
    return []
  }
  return data as BlogPost[]
}

export async function getBlogPostBySlug(slug: string) {
  console.log('Buscando post com slug:', slug)
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar post:', error.message)
    return null
  }
  
  if (!data) {
    console.warn('Aviso: Nenhum post publicado encontrado com o slug:', slug)
    return null
  }

  return data as BlogPost
}

export async function getAllBlogPostSlugs() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')

  if (error) return []
  return data.map(post => post.slug)
}
