"use client"

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Truck, Heart, Store } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product, formatCurrency } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { Lock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  showActions?: boolean
}

export function ProductCard({ product, variant = 'default', showActions = true }: ProductCardProps) {
  const { addItem } = useCart()
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavorites()
  const { user } = useAuth()
  const isFavorite = isFavoriteProduct(product.id)
  const isLoggedIn = !!user

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavoriteProduct(product.id)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/produto/${product.id}`}>
        <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 bg-card border-border">
          <div className="flex gap-3 p-3">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-primary mt-1">
                {formatCurrency(product.wholesalePrice)}
              </p>
              <p className="text-xs text-muted-foreground">
                Mín. {product.minQuantity} un.
              </p>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/produto/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 bg-card border-border/60 hover:border-primary/30 h-full flex flex-col rounded-2xl">
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {product.readyToShip && (
            <Badge className="absolute top-3 left-3 bg-primary text-white border-0 gap-1.5 shadow-lg backdrop-blur-md">
              <Truck className="w-3.5 h-3.5" />
              Pronta Entrega
            </Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0"
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">
              {product.modalities[0]}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                <Store className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground truncate">{product.supplierName}</span>
              {product.supplierVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
            {isLoggedIn ? (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Preço no Atacado</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(product.wholesalePrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary/80">
                    Mín. {product.minQuantity} un.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
                <p className="text-xs font-bold text-primary">
                  Login para ver preços
                </p>
              </div>
            )}

            {showActions && (
              <Button
                size="sm"
                variant={isLoggedIn ? "default" : "outline"}
                className="w-full h-10 text-sm font-bold rounded-xl shadow-sm group-hover:shadow-md transition-all active:scale-[0.98]"
                onClick={handleAddToCart}
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? "Solicitar Orçamento" : "Criar Conta Grátis"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
