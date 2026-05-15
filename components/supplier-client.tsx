"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Share2, Heart, Youtube, Instagram, Facebook, Globe, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { formatCurrency } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function SupplierClient({ supplierId }: { supplierId: string }) {
  const [supplier, setSupplier] = useState<any>(null)
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSupplierData() {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUUID = uuidRegex.test(supplierId);

        let query = supabase.from('suppliers').select('*');
        if (isUUID) {
          query = query.eq('id', supplierId);
        } else {
          query = query.eq('slug', supplierId);
        }

        let { data: profile } = await query.single();
        
        if (!profile && !isUUID) {
           const decodedName = decodeURIComponent(supplierId);
           const { data: profileByName } = await supabase
             .from('suppliers')
             .select('*')
             .ilike('name', decodedName)
             .limit(1)
             .single();
           
           if (profileByName) {
             profile = profileByName;
           }
        }
        
        if (profile) {
          const mappedProfile = {
            ...profile,
            logo: profile.logo || '/placeholder-logo.png',
            coverImage: profile.cover_image || '/placeholder.jpg',
            minOrderValue: profile.min_order_value || 0,
            whatsapp: profile.whatsapp || '',
            bio: profile.description || '',
          }
          setSupplier(mappedProfile)
          
          const { data: prods } = await supabase
            .from('products')
            .select('*')
            .or(`supplier_id.eq.${profile.id},supplier_id.eq.${profile.user_id}`)
          
          if (prods) setSupplierProducts(prods)
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
          <h1 className="text-2xl font-bold text-foreground mb-4">Fornecedor não encontrado</h1>
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Banner Hero */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src={supplier.coverImage}
          alt={supplier.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="container relative h-full mx-auto px-4">
          <Link 
            href="/" 
            className="absolute top-6 left-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Marketplace</span>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4">
        {/* Floating Header Card */}
        <div className="relative -mt-32 mb-12">
          <Card className="overflow-hidden border-none shadow-2xl bg-card/95 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-8 p-8">
                {/* Logo */}
                <div className="relative -mt-20 md:mt-0">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-4 border-card overflow-hidden bg-card shadow-2xl">
                    <Image
                      src={supplier.logo}
                      alt={supplier.name}
                      width={176}
                      height={176}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {supplier.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl shadow-xl border-4 border-card">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                      {supplier.name}
                    </h1>
                    <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px]">
                      {supplier.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span>{supplier.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="text-[10px] font-bold text-primary">R$</div>
                      </div>
                      <span>Mínimo: {formatCurrency(supplier.minOrderValue)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Button size="lg" className="rounded-2xl h-14 px-8 text-base font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-green-500 hover:bg-green-600 border-none" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Direto
                    </a>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 border-border/40 hover:bg-muted font-bold">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button variant="outline" className="rounded-2xl h-12 w-12 border-border/40 hover:bg-muted p-0">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="produtos" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 border border-border/40 self-start">
              <TabsTrigger value="produtos" className="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:shadow-lg font-bold text-base">
                Catálogo
              </TabsTrigger>
              <TabsTrigger value="sobre" className="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:shadow-lg font-bold text-base">
                Sobre
              </TabsTrigger>
              <TabsTrigger value="contato" className="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:shadow-lg font-bold text-base">
                Contato
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-xl border border-border/40">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Fornecedor verificado e ativo
            </div>
          </div>

          <TabsContent value="produtos" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {supplierProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  wholesalePrice: product.price || 0,
                  image: product.image_url || product.image || '/placeholder-product.jpg',
                  minQuantity: product.min_quantity || 1,
                  category: product.categoria || 'Geral',
                  supplierName: supplier.name,
                  supplierVerified: supplier.verified
                }} showActions={true} />
              ))}
            </div>
            
            {supplierProducts.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                <p className="text-muted-foreground text-lg">Nenhum produto cadastrado no momento.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sobre" className="mt-0">
            <Card className="rounded-3xl border-border/40 bg-card/50">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold mb-6">Sobre a {supplier.name}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                  {supplier.bio || "Nenhuma descrição detalhada disponível para este fornecedor."}
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
                    <h4 className="font-bold mb-2">Estado</h4>
                    <p className="text-muted-foreground">{supplier.state}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
                    <h4 className="font-bold mb-2">Especialidade</h4>
                    <p className="text-muted-foreground">{supplier.category}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
                    <h4 className="font-bold mb-2">Plano</h4>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {supplier.plan}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contato" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-border/40 bg-card/50 overflow-hidden">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-8">Informações de Contato</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp Profissional</p>
                        <p className="font-bold text-lg">{supplier.whatsapp}</p>
                      </div>
                    </div>
                    {supplier.email && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                          < Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">E-mail Corporativo</p>
                          <p className="font-bold text-lg">{supplier.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-3xl border-border/40 bg-card/50 overflow-hidden">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-8">Redes Sociais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      Instagram
                    </Button>
                    <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold">
                      <Youtube className="w-5 h-5 text-red-600" />
                      YouTube
                    </Button>
                    <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      Facebook
                    </Button>
                    <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold">
                      <Globe className="w-5 h-5 text-primary" />
                      Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
