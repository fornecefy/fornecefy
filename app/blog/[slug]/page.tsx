import { getBlogPostBySlug } from '@/lib/services/blog-service'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.seo_title || post.title} | Blog Fornecefy`,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Voltar ao Blog
          </Link>

          {/* Header */}
          <header className="mb-10 text-center">
            <Badge className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {post.published_at 
                    ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
                    : 'Recentemente'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>5 min de leitura</span>
              </div>
              <div className="flex items-center gap-4 ml-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/40">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16 px-4 md:px-0 prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Social Share Footer */}
          <div className="bg-muted/30 border border-border/40 rounded-3xl p-8 md:p-10 text-center mb-16">
            <h3 className="text-xl font-bold mb-6">Gostou deste conteúdo? Compartilhe!</h3>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="gap-2 rounded-full h-12 px-6 hover:bg-blue-600 hover:text-white border-blue-600/20">
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              <Button variant="outline" className="gap-2 rounded-full h-12 px-6 hover:bg-sky-400 hover:text-white border-sky-400/20">
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button variant="outline" className="gap-2 rounded-full h-12 px-6 hover:bg-primary hover:text-white border-primary/20">
                <LinkIcon className="w-4 h-4" />
                Copiar Link
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
