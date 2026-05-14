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
import { products, suppliers, formatCurrency } from '@/lib/data'

export default function FavoritosPage() {
  const { 
    favoriteProducts, 
    favoriteSuppliers, 
    removeFavoriteProduct,
    removeFavoriteSupplier,
    getFavoriteProductsCount,
    getFavoriteSuppliersCount
  } = useFavorites()

  const favoriteProductsList = products.filter(p => favoriteProducts.includes(p.id))
  const favoriteSuppliersList = suppliers.filter(s => favoriteSuppliers.includes(s.id))

  const productsCount = getFavoriteProductsCount()
  const suppliersCount = getFavoriteSuppliersCount()

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
                  {productsCount + suppliersCount} itens salvos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="produtos" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="produtos" className="gap-2">
                <Package className="w-4 h-4" />
                Produtos ({productsCount})
              </TabsTrigger>
              <TabsTrigger value="fornecedores" className="gap-2">
                <Store className="w-4 h-4" />
                Fornecedores ({suppliersCount})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="produtos">
              {favoriteProductsList.length === 0 ? (
                <EmptyState 
                  icon={<Package className="w-16 h-16 text-muted-foreground" />}
                  title="Nenhum produto favorito"
                  description="Explore o marketplace e salve os produtos que você mais gostou clicando no coração."
                  actionLabel="Explorar produtos"
                  actionHref="/"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {productsCount} produto{productsCount !== 1 ? 's' : ''} salvo{productsCount !== 1 ? 's' : ''}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => favoriteProducts.forEach(id => removeFavoriteProduct(id))}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar tudo
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {favoriteProductsList.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Suppliers Tab */}
            <TabsContent value="fornecedores">
              {favoriteSuppliersList.length === 0 ? (
                <EmptyState 
                  icon={<Store className="w-16 h-16 text-muted-foreground" />}
                  title="Nenhum fornecedor favorito"
                  description="Salve seus fornecedores preferidos para acessá-los rapidamente."
                  actionLabel="Ver fornecedores"
                  actionHref="/"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {suppliersCount} fornecedor{suppliersCount !== 1 ? 'es' : ''} salvo{suppliersCount !== 1 ? 's' : ''}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => favoriteSuppliers.forEach(id => removeFavoriteSupplier(id))}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar tudo
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteSuppliersList.map(supplier => (
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
  supplier: typeof suppliers[0]
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
