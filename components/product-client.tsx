"use client"

import { use, useState, useEffect } from 'react'
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
  Lock,
  ChevronDown,
  ChevronUp,
  Search as SearchIcon,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { formatCurrency, Modalidade } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export default function ProductClient({ productId }: { productId: string }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavorites()
  const { user } = useAuth()
  
  const [product, setProduct] = useState<any>(null)
  const [supplier, setSupplier] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [quantity, setQuantity] = useState(1)
  const [selectedModality, setSelectedModality] = useState<Modalidade>("Atacado")
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState('')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  useEffect(() => {
    async function fetchProductData() {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUUID = uuidRegex.test(productId);

        let query = supabase.from('products').select('*');
        
        if (isUUID) {
          query = query.eq('id', productId);
        } else {
          query = query.eq('slug', productId);
        }

        const { data: prod, error: prodError } = await query.maybeSingle();

        if (prodError || !prod) {
          console.warn('Produto não encontrado:', productId)
          setIsLoading(false)
          return
        }

        // Map to expected format
        const mappedProd = {
          ...prod,
          wholesalePrice: prod.wholesale_price || prod.price || 0,
          image: prod.image_url || prod.image || '/placeholder-product.jpg',
          minQuantity: prod.min_quantity || 1,
          category: prod.category || prod.categoria || 'Geral',
          subcategory: prod.subcategory || prod.subcategoria || null,
          supplier_id: prod.supplier_id,
        }

        setProduct(mappedProd)
        setActiveImage(mappedProd.image)
        setQuantity(mappedProd.minQuantity)

        if (mappedProd.supplier_id) {
          // Busca o fornecedor tentando pelo ID direto ou pelo User ID vinculado
          const { data: supp } = await supabase
            .from('suppliers')
            .select('*')
            .or(`id.eq.${mappedProd.supplier_id},user_id.eq.${mappedProd.supplier_id}`)
            .maybeSingle()
          
          if (supp) {
            setSupplier({
              ...supp,
              logo: supp.company_logo_url || '/placeholder-logo.png'
            })
          }

          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('supplier_id', mappedProd.supplier_id)
            .neq('id', mappedProd.id)
            .limit(4)
          
          if (related) {
            setRelatedProducts(related.map(r => ({
              ...r,
              wholesalePrice: r.wholesale_price || r.price || 0,
              image: r.image_url || r.image || '/placeholder-product.jpg',
              minQuantity: r.min_quantity || 1,
              category: r.category || r.categoria || 'Geral',
              supplierName: supp.name,
              supplierVerified: supp.verified
            })))
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProductData()
  }, [productId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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

  const currentPrice = product.wholesalePrice
  const isFavorite = isFavoriteProduct(product.id)
  const totalPrice = currentPrice * quantity

  const handleFavorite = () => {
    if (!user) {
      router.push(`/login?redirect=/produto/${productId}`)
      return
    }
    toggleFavoriteProduct(product.id)
  }

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
        <div className="bg-muted border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Início
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/?categoria=${encodeURIComponent(product.category)}`} className="text-muted-foreground hover:text-foreground shrink-0">
                {product.category}
              </Link>
              {product.subcategory && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <Link href={`/?categoria=${encodeURIComponent(product.category)}&subcategoria=${encodeURIComponent(product.subcategory)}`} className="text-muted-foreground hover:text-foreground shrink-0">
                    {product.subcategory}
                  </Link>
                </>
              )}
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 -ml-2 md:hidden"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-[450px_1fr] gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogTrigger asChild>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border cursor-zoom-in group shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={activeImage || product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                        <SearchIcon className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
                  <DialogTitle className="sr-only">Visualização ampliada do produto</DialogTitle>
                  <div className="relative w-full h-[90vh] flex items-center justify-center group">
                    <img 
                      src={activeImage || product.image} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg cursor-zoom-out"
                      onClick={() => setIsZoomOpen(false)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 border-none"
                      onClick={() => setIsZoomOpen(false)}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Gallery Thumbnails */}
              {(product.gallery && product.gallery.length > 0) && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[product.image, ...(product.gallery || [])].slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Tags / Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary/70 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                  Atacado
                </span>
                {product.ready_to_ship && (
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-widest font-bold bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/20 gap-1 shadow-none">
                    <Truck className="w-3.5 h-3.5" />
                    Pronta Entrega
                  </Badge>
                )}
                {product.collections && Array.isArray(product.collections) && product.collections.map((col: string, idx: number) => (
                   <span key={idx} className="text-[10px] uppercase tracking-widest font-bold text-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                     {col}
                   </span>
                ))}
                {product.tags && Array.isArray(product.tags) && product.tags.map((tag: string, idx: number) => (
                   <span key={idx} className="text-xs uppercase tracking-wider font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Title */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl hover:bg-muted transition-colors"
                    onClick={handleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl hover:bg-muted transition-colors"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
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
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantidade mínima</span>
                  <span className="font-medium">{product.minQuantity} unidades</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Disponibilidade</span>
                  <Badge variant={product.readyToShip ? 'default' : 'secondary'}>
                    {product.readyToShip ? 'Pronta Entrega' : 'Sob Encomenda'}
                  </Badge>
                </div>
              </div>

              {/* Description Section */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Descrição do Produto</h3>
                  <div className="relative">
                    <p className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${!showFullDescription && product.description.length > 300 ? 'line-clamp-4' : ''}`}>
                      {product.description}
                    </p>
                    {product.description.length > 300 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-primary text-sm font-medium hover:underline mt-1 flex items-center gap-1"
                      >
                        {showFullDescription ? (
                          <>Ver menos <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Ver mais <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {user ? (
                <>
                  <Separator />
                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Quantidade</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-r-none"
                          onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))}
                          disabled={quantity <= product.minQuantity}
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
                      src={supplier.logo || '/placeholder-logo.png'}
                      alt={supplier.name}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
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
                    <Link href={`/fornecedor/${supplier.slug || supplier.id}`}>
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
                <Link href={`/fornecedor/${supplier.slug || supplier.id}`}>
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
