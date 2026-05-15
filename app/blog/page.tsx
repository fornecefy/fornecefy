import { getBlogPosts } from '@/lib/services/blog-service'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ChevronRight, Share2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const metadata = {
  title: 'Blog Fornecefy | Notícias, Tendências e Dicas para o Atacado',
  description: 'Fique por dentro das últimas novidades do mercado B2B, tendências de moda, logística e tecnologia para impulsionar seu negócio.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <Badge className="mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20">Nosso Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Insights para o seu <span className="text-primary italic">Crescimento</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Notícias, tendências e guias práticos sobre o mercado B2B e atacadista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/40 hover:border-primary/20 rounded-2xl bg-card">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none px-3 py-1">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {post.published_at 
                          ? format(new Date(post.published_at), 'dd MMM, yyyy', { locale: ptBR })
                          : 'Recentemente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>5 min de leitura</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                    <span className="text-sm font-bold text-primary inline-flex items-center gap-1">
                      Ler artigo completo <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
