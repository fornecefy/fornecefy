"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Share2, UserPlus, Users, Youtube, Instagram, Facebook, Globe, AlertTriangle, Search, Filter } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export default function SupplierClient({ supplierId }: { supplierId: string }) {
  const [supplier, setSupplier] = useState<any>(null)
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const { addItem } = useCart()
  const { isFavoriteProduct, toggleFavoriteProduct, toggleFavoriteSupplier, isFavoriteSupplier } = useFavorites()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (supplier) {
      setIsFollowing(isFavoriteSupplier(supplier.id))
    }
  }, [supplier, isFavoriteSupplier])

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
            logo: profile.company_logo_url || '/placeholder-logo.png',
            coverImage: profile.cover_image_url || '/placeholder.jpg',
            minOrderValue: profile.min_order_value || 0,
            whatsapp: profile.whatsapp || '',
            bio: profile.description || '',
            youtube_video_url: profile.youtube_video_url || '',
          }
          setSupplier(mappedProfile)
          setIsFollowing(isFavoriteSupplier(mappedProfile.id))
          
          const { data: prods } = await supabase
            .from('products')
            .select('*')
            .or(`supplier_id.eq.${profile.id},supplier_id.eq.${profile.user_id}`)
          
          if (prods) {
            const mappedProds = prods.map(p => ({
              ...p,
              wholesalePrice: p.wholesale_price || p.price || 0,
              image: p.image_url || p.image || '/placeholder-product.jpg',
              minQuantity: p.min_quantity || 1,
              category: p.category || p.categoria || 'Geral',
              supplierName: mappedProfile.name,
              supplierVerified: mappedProfile.verified_badge
            }))
            setSupplierProducts(mappedProds)
            setFilteredProducts(mappedProds)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar vitrine:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSupplierData()
  }, [supplierId, isFavoriteSupplier])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(supplierProducts)
    } else {
      const query = searchTerm.toLowerCase()
      setFilteredProducts(supplierProducts.filter(p => 
        (p.name || '').toLowerCase().includes(query) || 
        (p.description || '').toLowerCase().includes(query)
      ))
    }
  }, [searchTerm, supplierProducts])

  const categoriesAndMore = useMemo(() => {
    if (!supplierProducts) return { categories: [], collections: [], tags: [] }
    const cats = new Set<string>()
    const colls = new Set<string>()
    const tgs = new Set<string>()

    supplierProducts.forEach(p => {
      if (p.category) cats.add(p.category)
      if (p.collections && Array.isArray(p.collections)) {
        p.collections.forEach((c: string) => colls.add(c))
      }
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t: string) => tgs.add(t))
      }
    })

    return {
      categories: Array.from(cats).sort(),
      collections: Array.from(colls).sort(),
      tags: Array.from(tgs).sort()
    }
  }, [supplierProducts])

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: supplier.name,
        text: `Confira a vitrine de ${supplier.name} no Fornecefy!`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handleFollow = () => {
    if (!user) {
      router.push(`/login?redirect=/fornecedor/${supplierId}`)
      return
    }
    toggleFavoriteSupplier(supplier.id)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null
    let videoId = ''
    if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0]
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0]
    else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0]
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Banner Hero */}
      <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden">
        <Image
          src={supplier.coverImage}
          alt={supplier.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <main className="container mx-auto px-4">
        {/* Floating Header Card */}
        <div className="relative -mt-16 mb-8">
          <Card className="overflow-hidden border-none shadow-xl bg-card/95 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-5 p-6">
                {/* Logo */}
                <div className="relative shrink-0 -mt-16 md:-mt-0">
                  <div className="w-24 h-24 rounded-full border-4 border-card bg-card shadow-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={supplier.logo || '/placeholder-logo.png'}
                      alt={supplier.name}
                      width={96}
                      height={96}
                      className="object-cover rounded-full h-full w-full"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                      {supplier.name}
                      {supplier.verified_badge && (
                        <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />
                      )}
                    </h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold px-2.5 py-0.5">
                      {supplier.category}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {supplier.state}
                    </div>
                    <span className="text-border hidden md:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary font-bold">R$</span>
                      Pedido mínimo: {formatCurrency(supplier.minOrderValue)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    className={`rounded-xl px-6 h-10 font-bold shadow-md gap-2 text-sm ${isFollowing ? 'bg-muted text-foreground shadow-none' : 'bg-primary text-primary-foreground shadow-primary/20'}`}
                    onClick={handleFollow}
                  >
                    <Users className="w-4 h-4" />
                    {isFollowing ? 'Seguindo' : 'Seguir Loja'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
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

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" className="rounded-xl h-11 gap-2 font-bold" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Compartilhar Catálogo
              </Button>
            </div>
          </div>

          <TabsContent value="produtos" className="mt-0">
            {/* Categories, Collections and Tags */}
            <div className="mb-6 flex flex-col gap-3">
              {categoriesAndMore.categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">Categorias:</span>
                  {categoriesAndMore.categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
              
              {categoriesAndMore.collections.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">Coleções:</span>
                  {categoriesAndMore.collections.map((col, idx) => (
                    <Badge key={idx} variant="outline" className="rounded-full border-primary/30 text-foreground px-3 py-1 text-xs">
                      {col}
                    </Badge>
                  ))}
                </div>
              )}

              {categoriesAndMore.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">Tags:</span>
                  {categoriesAndMore.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="rounded-full border-muted-foreground/30 text-muted-foreground px-3 py-1 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar produtos neste catálogo..." 
                  className="pl-10 h-12 rounded-xl border-border/40 bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold px-6">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  wholesalePrice: product.price || 0,
                  image: product.image_url || product.image || '/placeholder-product.jpg',
                  minQuantity: product.min_quantity || 1,
                  category: product.categoria || 'Geral',
                  supplierName: supplier.name,
                  supplierVerified: supplier.verified_badge
                }} showActions={true} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                <p className="text-muted-foreground text-lg">Nenhum produto cadastrado no momento.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sobre" className="mt-0">
            <Card className="rounded-3xl border-border/40 bg-card/50">
              <CardContent className="p-10">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Sobre a {supplier.name}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                      {supplier.bio || "Nenhuma descrição detalhada disponível para este fornecedor."}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                        <h4 className="font-bold text-sm mb-1">Estado</h4>
                        <p className="text-sm text-muted-foreground">{supplier.state}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                        <h4 className="font-bold text-sm mb-1">Especialidade</h4>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                        <h4 className="font-bold text-sm mb-1">Plano</h4>
                        <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
                          {supplier.plan}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Embed */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      Vídeo de Apresentação
                    </h3>
                    {supplier.youtube_video_url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40 shadow-xl bg-black">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={getYoutubeEmbedUrl(supplier.youtube_video_url) || ''}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                        <Youtube className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">Nenhum vídeo disponível</p>
                      </div>
                    )}
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
