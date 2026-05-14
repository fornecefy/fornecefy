"use client"

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus, 
  BadgeCheck, 
  Truck, 
  Package as PackageIcon, 
  MessageCircle,
  Store,
  MapPin,
  Youtube,
  Instagram,
  Facebook,
  AlertTriangle,
  Play,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { products, suppliers, formatCurrency, Modalidade } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useAuth } from '@/lib/auth-context'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem } = useCart()
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavorites()
  const { user } = useAuth()
  
  const product = products.find(p => p.id === id)
  const supplier = product ? suppliers.find(s => s.id === product.supplierId) : null
  const relatedProducts = product 
    ? products.filter(p => p.supplierId === product.supplierId && p.id !== product.id).slice(0, 4)
    : []
  
  const [quantity, setQuantity] = useState(product?.minQuantity || 1)
  const [selectedModality, setSelectedModality] = useState<Modalidade>(product?.modalities[0] || "Atacado")
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(product?.image || '')

  // Update quantity if modality changes and minQuantity is higher
  const currentPriceData = product?.prices?.[selectedModality] || { price: product?.wholesalePrice || 0, minQuantity: product?.minQuantity || 1 }
  const currentPrice = currentPriceData.price
  const currentMinQuantity = currentPriceData.minQuantity

  const handleModalityChange = (mod: Modalidade) => {
    setSelectedModality(mod)
    const priceData = product?.prices?.[mod]
    if (priceData && quantity < priceData.minQuantity) {
      setQuantity(priceData.minQuantity)
    }
  }

  if (!product || !supplier) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <PackageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-6">O produto que você procura não existe ou foi removido.</p>
            <Button onClick={() => router.push('/')}>Voltar ao início</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isFavorite = isFavoriteProduct(product.id)
  const totalPrice = currentPrice * quantity

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira ${product.name} no Fornecefy`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado!")
    }
  }

  const handleReport = () => {
    const reason = prompt("Por que você deseja denunciar este produto?")
    if (reason) {
      alert("Denúncia enviada com sucesso. Nossa equipe analisará em breve.")
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Vi o produto "${product.name}" no Fornecefy e gostaria de mais informações.\n\nPreço atacado: ${formatCurrency(product.wholesalePrice)}\nQuantidade mínima: ${product.minQuantity} un`
    )
    window.open(`https://wa.me/${supplier.whatsapp}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Início
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/?categoria=${encodeURIComponent(product.category)}`} className="text-muted-foreground hover:text-foreground">
                {product.category}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Back button - Mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 -ml-2 md:hidden"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                <Image
                  src={activeImage || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.readyToShip && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    <Truck className="w-3 h-3 mr-1" />
                    Pronta Entrega
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => toggleFavoriteProduct(product.id)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white shadow-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {(product.gallery && product.gallery.length > 0) && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[product.image, ...(product.gallery || [])].slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Video Section */}
              {product.youtubeUrl && (
                <Card className="overflow-hidden border-border bg-muted/50">
                  <div className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vídeo do Produto</p>
                      <p className="text-xs text-muted-foreground">Assista no YouTube</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={product.youtubeUrl} target="_blank" rel="noopener noreferrer">Ver Vídeo</a>
                    </Button>
                  </div>
                </Card>
              )}

              {/* Report Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground hover:text-destructive flex items-center justify-center gap-2"
                onClick={handleReport}
              >
                <AlertTriangle className="w-4 h-4" />
                Denunciar Produto
              </Button>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Supplier Badge */}
              <Link href={`/fornecedor/${supplier.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Image
                  src={supplier.logo}
                  alt={supplier.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span>{supplier.name}</span>
                {supplier.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
              </Link>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                {product.name}
              </h1>
              
              {product.sku && (
                <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
              )}

              {/* Price */}
              <div className="space-y-1">
                {user ? (
                  <>
                    <p className="text-3xl md:text-4xl font-bold text-foreground">
                      {formatCurrency(currentPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Preço por unidade ({selectedModality.toLowerCase()})
                    </p>
                  </>
                ) : (
                  <div className="bg-muted/50 rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                      <Lock className="w-5 h-5" />
                      <span className="font-semibold">Preços restritos</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apenas usuários cadastrados e logados podem visualizar os preços e realizar pedidos.
                    </p>
                    <Link href="/login">
                      <Button className="w-full gap-2">
                        Fazer Login para ver Preços
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-4">
                {product.modalities.length > 1 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modalidade</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.modalities.map(mod => (
                        <Button
                          key={mod}
                          variant={selectedModality === mod ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleModalityChange(mod as Modalidade)}
                        >
                          {mod}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantidade mínima</span>
                  <span className="font-medium">{currentMinQuantity} unidades</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Disponibilidade</span>
                  <Badge variant={product.readyToShip ? 'default' : 'secondary'}>
                    {product.readyToShip ? 'Pronta Entrega' : 'Sob Encomenda'}
                  </Badge>
                </div>
              </div>

              {user ? (
                <>
                  <Separator />
                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Quantidade</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-r-none"
                          onClick={() => setQuantity(Math.max(currentMinQuantity, quantity - 1))}
                          disabled={quantity <= currentMinQuantity}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-16 text-center font-medium">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-l-none"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: <span className="font-semibold text-foreground">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mínimo de {currentMinQuantity} unidades para {selectedModality}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      size="lg" 
                      className="flex-1 gap-2"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addedToCart ? 'Adicionado!' : 'Adicionar ao Orçamento'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="flex-1 gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    asChild
                  >
                    <Link href="/cadastro">Cadastre-se para comprar</Link>
                  </Button>
                </div>
              )}

              {/* Supplier Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Image
                      src={supplier.logo}
                      alt={supplier.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{supplier.name}</h3>
                        {supplier.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {supplier.state}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pedido mínimo: {formatCurrency(supplier.minOrderValue)}
                      </p>
                    </div>
                    <Link href={`/fornecedor/${supplier.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Store className="w-4 h-4" />
                        Ver Loja
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Mais produtos deste fornecedor</h2>
                <Link href={`/fornecedor/${supplier.id}`}>
                  <Button variant="ghost" size="sm">Ver todos</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
