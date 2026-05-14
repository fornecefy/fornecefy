"use client"

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Truck, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product, formatCurrency } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useAuth } from '@/lib/auth-context'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
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
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.readyToShip && (
            <Badge className="absolute top-2 left-2 bg-emerald-500 text-white border-0 gap-1">
              <Truck className="w-3 h-3" />
              Pronta Entrega
            </Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        <CardContent className="p-3 flex-1 flex flex-col">
          {/* Modality Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.modalities.map((mod) => (
              <Badge key={mod} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground font-normal border-0">
                {mod}
              </Badge>
            ))}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[11px] text-muted-foreground truncate">{product.supplierName}</span>
              {product.supplierVerified && (
                <BadgeCheck className="w-3 h-3 text-primary flex-shrink-0" />
              )}
            </div>
          </div>

          <div className="mt-auto space-y-2">
            {isLoggedIn ? (
              <div>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(product.wholesalePrice)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Pedido mín. {product.minQuantity} un.
                </p>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-md p-2 text-center">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Faça login para ver preços
                </p>
              </div>
            )}

            <Button
              size="sm"
              variant={isLoggedIn ? "default" : "outline"}
              className="w-full h-8 text-xs"
              onClick={handleAddToCart}
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? "Adicionar ao Orçamento" : "Login para comprar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
