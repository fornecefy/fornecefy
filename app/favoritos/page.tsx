"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Package, Store, MapPin, BadgeCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useFavorites } from '@/lib/favorites-context'
import { formatCurrency } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { getSuppliers } from '@/lib/services/supplier-service'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function FavoritosPage() {
  const { 
    favoriteProducts, 
    favoriteSuppliers, 
    removeFavoriteProduct,
    removeFavoriteSupplier,
    getFavoriteProductsCount,
    getFavoriteSuppliersCount
  } = useFavorites()

  const [realProducts, setRealProducts] = useState<any[]>([])
  const [realSuppliers, setRealSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Buscar produtos favoritados
        if (favoriteProducts.length > 0) {
          const { data: prods } = await supabase
            .from('products')
            .select('*')
            .in('id', favoriteProducts)

          if (prods) {
            const formatted = prods.map(p => ({
              id: p.id,
              name: p.name,
              wholesalePrice: p.wholesale_price || 0,
              image: p.image_url || '/placeholder-product.jpg',
              supplierName: 'Fornecedor', // Temporário, será atualizado se necessário
              category: p.category || 'Geral',
              readyToShip: p.ready_to_ship || false,
              modalities: p.modalities || ['Atacado'],
            }))
            setRealProducts(formatted)
          }
        } else {
          setRealProducts([])
        }

        // 2. Buscar fornecedores favoritados (lojas seguidas)
        if (favoriteSuppliers.length > 0) {
          const { data: supsData } = await supabase
            .from('suppliers')
            .select('*')
            .in('id', favoriteSuppliers)

          if (supsData) {
            const mappedSups = supsData.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              logo: item.company_logo_url || '/placeholder-logo.png',
              coverImage: item.cover_image_url || '/placeholder.jpg',
              bio: item.description || '',
              minOrderValue: item.min_order_value || 0,
              state: item.state || '',
              category: item.category || 'Geral',
              whatsapp: item.whatsapp || '',
              modalities: item.modalities || ['Atacado'],
              plan: item.plan || 'Básico',
              verified: item.verified || false,
              rating: item.rating || 0,
              products: [],
            }))
            setRealSuppliers(mappedSups)
          }
        } else {
          setRealSuppliers([])
        }

      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [favoriteProducts, favoriteSuppliers])

  const favoriteProductsList = realProducts

  const productsCount = favoriteProductsList.length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
                <p className="text-sm text-muted-foreground">
                  {productsCount} {productsCount === 1 ? 'item salvo' : 'itens salvos'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Buscando seus favoritos...</p>
            </div>
          ) : (
            <Tabs defaultValue="produtos" className="space-y-6">
              <TabsList className="bg-muted p-1 rounded-xl h-12 border border-border w-full max-w-md">
                <TabsTrigger value="produtos" className="rounded-lg px-6 h-full font-bold data-[state=active]:shadow-sm">
                  Produtos ({realProducts.length})
                </TabsTrigger>
                <TabsTrigger value="fornecedores" className="rounded-lg px-6 h-full font-bold data-[state=active]:shadow-sm">
                  Lojas que Sigo ({realSuppliers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="produtos" className="mt-0">
                {realProducts.length === 0 ? (
                  <EmptyState 
                    icon={<Package className="w-16 h-16 text-muted-foreground" />}
                    title="Nenhum produto favorito"
                    description="Explore o marketplace e salve os produtos que você mais gostou."
                    actionLabel="Explorar produtos"
                    actionHref="/"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {realProducts.length} produto{realProducts.length !== 1 ? 's' : ''} salvo{realProducts.length !== 1 ? 's' : ''}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => favoriteProducts.forEach(id => removeFavoriteProduct(id))}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar produtos
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {realProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fornecedores" className="mt-0">
                {realSuppliers.length === 0 ? (
                  <EmptyState 
                    icon={<Store className="w-16 h-16 text-muted-foreground" />}
                    title="Nenhuma loja seguida"
                    description="Siga seus fornecedores favoritos para acompanhar suas vitrines e novidades."
                    actionLabel="Explorar fornecedores"
                    actionHref="/"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {realSuppliers.length} loja{realSuppliers.length !== 1 ? 's' : ''} seguida{realSuppliers.length !== 1 ? 's' : ''}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => favoriteSuppliers.forEach(id => removeFavoriteSupplier(id))}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar lojas
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {realSuppliers.map(supplier => (
                        <SupplierCard 
                          key={supplier.id} 
                          supplier={supplier} 
                          onRemove={() => removeFavoriteSupplier(supplier.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <div className="text-center py-16">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      <Link href={actionHref}>
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  )
}

function SupplierCard({ 
  supplier, 
  onRemove 
}: { 
  supplier: any
  onRemove: () => void 
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-24 bg-muted">
        <Image
          src={supplier.coverImage}
          alt={supplier.name}
          fill
          className="object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
        >
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </Button>
      </div>
      <CardContent className="p-4">
        <Link href={`/fornecedor/${supplier.id}`}>
          <div className="flex items-start gap-3">
            <Image
              src={supplier.logo}
              alt={supplier.name}
              width={48}
              height={48}
              className="rounded-lg object-cover -mt-8 border-2 border-background shadow-sm"
            />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground truncate">{supplier.name}</h3>
                {supplier.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {supplier.state}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{supplier.category}</span>
              <span className="font-medium">Min: {formatCurrency(supplier.minOrderValue)}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
