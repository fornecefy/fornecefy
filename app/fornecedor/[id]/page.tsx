"use client"

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Share2, Heart, Youtube, Instagram, Facebook, Globe, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { CartProvider } from '@/lib/cart-context'
import { suppliers, formatCurrency } from '@/lib/data'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SupplierPageProps {
  params: Promise<{ id: string }>
}

function SupplierContent({ supplierId }: { supplierId: string }) {
  const [supplier, setSupplier] = useState<any>(null)
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSupplierData = async () => {
      setIsLoading(true)
      try {
        // Busca Perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supplierId)
          .single()
        
        if (profile) {
          setSupplier(profile)
          
          // Busca Produtos
          const { data: prods } = await supabase
            .from('products')
            .select('*')
            .eq('supplier_id', supplierId)
            .eq('is_active', true)
          
          if (prods) setSupplierProducts(prods)
        } else {
          // Fallback para mock apenas se o ID existir no mock
          const mockSupplier = suppliers.find((s) => s.id === supplierId)
          if (mockSupplier) {
            setSupplier(mockSupplier)
            setSupplierProducts(mockSupplier.products)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar vitrine:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSupplierData()
  }, [supplierId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Fornecedor não encontrado
          </h1>
          <Link href="/">
            <Button>Voltar ao Marketplace</Button>
          </Link>
        </main>
      </div>
    )
  }

  const whatsappUrl = `https://wa.me/${supplier.whatsapp || ''}?text=${encodeURIComponent(
    `Olá! Encontrei sua vitrine no Fornecefy e gostaria de saber mais sobre seus produtos.`
  )}`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: supplier.name,
        text: `Confira a vitrine de ${supplier.name} no Fornecefy`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link da vitrine copiado!")
    }
  }

  const handleReport = () => {
    const reason = prompt("Por que você deseja denunciar este fornecedor?")
    if (reason) {
      alert("Denúncia enviada. Obrigado por nos ajudar a manter a comunidade segura.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-muted">
        <Image
          src={supplier.coverImage || '/placeholder.jpg'}
          alt={`Capa de ${supplier.name}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <main className="container mx-auto px-4">
        {/* Supplier Header */}
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-background bg-card overflow-hidden shadow-lg">
              <Image
                src={supplier.logo || '/placeholder-logo.png'}
                alt={`Logo de ${supplier.name}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {supplier.name}
                </h1>
                {supplier.verified && (
                  <BadgeCheck className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{supplier.state}</span>
                <span className="mx-1">•</span>
                <span>{supplier.category}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Seguir
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive" onClick={handleReport}>
                  <AlertTriangle className="w-4 h-4" />
                  Denunciar
                </Button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-0 left-0 -translate-y-20 md:-translate-y-24"
          >
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="catalogo" className="mb-24">
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 gap-8">
            <TabsTrigger 
              value="catalogo" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full px-4"
            >
              Catálogo
            </TabsTrigger>
            <TabsTrigger 
              value="sobre"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full px-4"
            >
              Sobre Nós
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalogo" className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Produtos ({supplierProducts.length})
              </h2>
            </div>
            
            {supplierProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {supplierProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Este fornecedor ainda não cadastrou produtos.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sobre" className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Nossa História</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {supplier.bio}
                  </p>
                </section>

                {supplier.videoUrl && (
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Vídeo Institucional</h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border shadow-inner">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${supplier.videoUrl.split('v=')[1] || supplier.videoUrl.split('/').pop()}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Pedido Mínimo</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(supplier.minOrderValue)}
                    </p>
                  </CardContent>
                </Card>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Redes Sociais</h3>
                  <div className="space-y-3">
                    {supplier.socialLinks?.instagram && (
                      <Button variant="outline" className="w-full justify-start gap-3" asChild>
                        <a href={supplier.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {supplier.socialLinks?.facebook && (
                      <Button variant="outline" className="w-full justify-start gap-3" asChild>
                        <a href={supplier.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {supplier.socialLinks?.website && (
                      <Button variant="outline" className="w-full justify-start gap-3" asChild>
                        <a href={supplier.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 text-primary" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

    </div>
  )
}

export default function SupplierPage({ params }: SupplierPageProps) {
  const { id } = use(params)
  
  return (
    <CartProvider>
      <SupplierContent supplierId={id} />
    </CartProvider>
  )
}
