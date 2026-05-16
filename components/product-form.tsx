"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { 
  Package, 
  Truck, 
  Layers, 
  Settings2, 
  Tag, 
  Info, 
  Youtube as YoutubeIcon,
  Box,
  Ruler,
  Boxes
} from 'lucide-react'

import { CATEGORIES } from '@/lib/constants'

interface ProductFormProps {
  productId?: string
  initialSupplierId?: string
  onClose: () => void
  onSuccess: () => void
}

export function ProductForm({ productId, initialSupplierId, onClose, onSuccess }: ProductFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    wholesalePrice: '',
    retailPrice: '',
    dropshippingPrice: '',
    minQuantity: '1',
    readyToShip: true,
    image: '',
    gallery: [] as string[],
    sku: '',
    videoUrl: '',
    modalities: ['Atacado'] as string[],
    supplier_id: initialSupplierId || user?.id,
    
    // New Fields
    has_stock_control: false,
    stock_quantity: '0',
    weight: '',
    height: '',
    width: '',
    depth: '',
    shipping_type: 'Correios',
    collections: [] as string[],
    variations: [] as { name: string, values: string[] }[]
  })

  const [newCollection, setNewCollection] = useState('')
  const [variationName, setVariationName] = useState('')
  const [variationValues, setVariationValues] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [subcategorySearch, setSubcategorySearch] = useState('')

  const selectedCategoryData = CATEGORIES.find(c => c.name === formData.category)

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredSubcategories = selectedCategoryData?.subcategories.filter(sub => 
    sub.toLowerCase().includes(subcategorySearch.toLowerCase())
  ) || []

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    setIsFetching(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          name: data.name || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          description: data.description || '',
          wholesalePrice: data.wholesale_price?.toString() || '',
          retailPrice: data.retail_price?.toString() || '',
          dropshippingPrice: data.dropshipping_price?.toString() || '',
          minQuantity: data.min_quantity?.toString() || '1',
          readyToShip: data.ready_to_ship ?? true,
          image: data.image_url || '',
          gallery: data.gallery_urls || [],
          sku: data.sku || '',
          videoUrl: data.video_url || '',
          modalities: data.modalities || ['Atacado'],
          supplier_id: data.supplier_id,
          has_stock_control: data.has_stock_control || false,
          stock_quantity: data.stock_quantity?.toString() || '0',
          weight: data.weight || '',
          height: data.height || '',
          width: data.width || '',
          depth: data.depth || '',
          shipping_type: data.shipping_type || 'Correios',
          collections: data.collections || [],
          variations: data.variations || []
        })
      }
    } catch (err: any) {
      setError('Erro ao buscar produto: ' + err.message)
    } finally {
      setIsFetching(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      setError('A imagem deve ter no máximo 1MB')
      return
    }

    setUploadingImage(true)
    setError('')

    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      const data = await res.json()

      if (data.url) {
        if (isGallery) {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }))
        } else {
          setFormData(prev => ({ ...prev, image: data.url }))
        }
      } else {
        setError(data.error || 'Erro no upload')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor de upload')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (url: string, isGallery = false) => {
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })
      
      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery: prev.gallery.filter(u => u !== url) }))
      } else {
        setFormData(prev => ({ ...prev, image: '' }))
      }
    } catch (err) {
      console.error('Erro ao deletar imagem:', err)
      setError('Erro ao remover a imagem do servidor.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      setError('A imagem principal é obrigatória')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const wholesalePrice = parseFloat(formData.wholesalePrice)
      const retailPrice = formData.retailPrice ? parseFloat(formData.retailPrice) : null
      const dropshippingPrice = formData.dropshippingPrice ? parseFloat(formData.dropshippingPrice) : null
      const minQuantity = parseInt(formData.minQuantity)
      const stockQuantity = formData.has_stock_control ? parseInt(formData.stock_quantity) : 0

      if (isNaN(wholesalePrice)) {
        setError('Preço de atacado inválido')
        setIsLoading(false)
        return
      }

      if (!formData.supplier_id) {
        setError('Erro: ID do fornecedor não encontrado. Tente recarregar a página.')
        setIsLoading(false)
        return
      }

      const generateSlug = (text: string) => {
        return text
          .toString()
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
      }

      const productData = {
        name: formData.name,
        slug: generateSlug(formData.name),
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        wholesale_price: wholesalePrice,
        retail_price: isNaN(retailPrice as number) ? null : retailPrice,
        dropshipping_price: isNaN(dropshippingPrice as number) ? null : dropshippingPrice,
        min_quantity: isNaN(minQuantity) ? 1 : minQuantity,
        ready_to_ship: formData.readyToShip,
        image_url: formData.image,
        gallery_urls: formData.gallery,
        sku: formData.sku,
        video_url: formData.videoUrl,
        supplier_id: formData.supplier_id,
        modalities: formData.modalities,
        status: 'active',
        has_stock_control: formData.has_stock_control,
        stock_quantity: isNaN(stockQuantity) ? 0 : stockQuantity,
        weight: formData.weight,
        height: formData.height,
        width: formData.width,
        depth: formData.depth,
        shipping_type: formData.shipping_type,
        collections: formData.collections,
        variations: formData.variations
      }

      console.log('Salvando produto:', productData)

      if (productId) {
        const { error: dbError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('products')
          .insert([productData])
        if (dbError) throw dbError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError('Erro ao salvar produto: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="bg-muted/30 border-b p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{productId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          <p className="text-sm text-muted-foreground">Preencha os detalhes do seu produto para o marketplace</p>
        </div>
        <Button variant="outline" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-12 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="basic" className="rounded-lg gap-2">
              <Info className="w-4 h-4" /> Básicos
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg gap-2">
              <ImageIcon className="w-4 h-4" /> Mídia
            </TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-lg gap-2">
              <Tag className="w-4 h-4" /> Preços & Estoque
            </TabsTrigger>
            <TabsTrigger value="logistics" className="rounded-lg gap-2">
              <Truck className="w-4 h-4" /> Logística
            </TabsTrigger>
            <TabsTrigger value="variations" className="rounded-lg gap-2">
              <Layers className="w-4 h-4" /> Variações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-bold">Nome do Produto</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Camiseta Oversized Premium"
                  className="h-12 text-lg"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="sku" className="text-base font-bold">Código SKU / Referência</Label>
                <Input 
                  id="sku" 
                  placeholder="Ex: MOD-123-PRETO"
                  className="h-12"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-bold">Categoria</Label>
                <Select value={formData.category} onValueChange={(v) => {
                  setFormData(prev => ({ ...prev, category: v, subcategory: '' }))
                  setCategorySearch('')
                }}>
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 border-b sticky top-0 bg-popover z-10">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Pesquisar categoria..." 
                          className="pl-8 h-9"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-xs text-center text-muted-foreground">Nenhuma categoria encontrada</div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="subcategory" className="text-base font-bold">Subcategoria</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(v) => {
                    setFormData(prev => ({ ...prev, subcategory: v }))
                    setSubcategorySearch('')
                  }}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="subcategory" className="h-12">
                    <SelectValue placeholder={formData.category ? "Selecione" : "Escolha a categoria primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 border-b sticky top-0 bg-popover z-10">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Pesquisar subcategoria..." 
                          className="pl-8 h-9"
                          value={subcategorySearch}
                          onChange={(e) => setSubcategorySearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredSubcategories.length > 0 ? (
                        filteredSubcategories.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-xs text-center text-muted-foreground">Nenhuma encontrada</div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="desc" className="text-base font-bold">Descrição Completa</Label>
              <Textarea 
                id="desc" 
                rows={8} 
                className="resize-none"
                placeholder="Descreva materiais, cores, tamanhos e diferenciais..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-bold">Coleções / Tags</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Inverno 2024, Promoção..." 
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (newCollection.trim()) {
                        setFormData(prev => ({ ...prev, collections: [...prev.collections, newCollection.trim()] }))
                        setNewCollection('')
                      }
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    if (newCollection.trim()) {
                      setFormData(prev => ({ ...prev, collections: [...prev.collections, newCollection.trim()] }))
                      setNewCollection('')
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.collections.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 px-3 py-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setFormData(prev => ({ ...prev, collections: prev.collections.filter((_, i) => i !== idx) }))}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Label className="text-base font-bold mb-4 block">Imagem de Capa</Label>
                {formData.image ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 bg-muted shadow-inner group">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="lg" 
                        className="gap-2"
                        onClick={() => handleDeleteImage(formData.image)}
                      >
                        <Trash2 className="w-5 h-5" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-4 border-dashed border-muted-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                    {uploadingImage ? (
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-primary mb-4" />
                        <span className="font-bold">Upload Principal</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-bold mb-4 block">Galeria de Fotos (Até 4)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.gallery.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteImage(url, true)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {formData.gallery.length < 4 && (
                      <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 cursor-pointer">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="video" className="text-base font-bold flex items-center gap-2">
                    <YoutubeIcon className="w-4 h-4 text-red-600" /> URL do Vídeo (YouTube)
                  </Label>
                  <Input 
                    id="video" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="wholesale" className="text-base font-bold">Preço Atacado</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground font-medium text-sm">R$</span>
                  <Input 
                    id="wholesale" 
                    type="number" 
                    step="0.01"
                    className="pl-10 h-12"
                    placeholder="0,00"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, wholesalePrice: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="retail" className="text-base font-bold">Preço Varejo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground font-medium text-sm">R$</span>
                  <Input 
                    id="retail" 
                    type="number" 
                    step="0.01"
                    className="pl-10 h-12"
                    placeholder="0,00"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, retailPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="dropshipping" className="text-base font-bold">Preço Dropshipping</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground font-medium text-sm">R$</span>
                  <Input 
                    id="dropshipping" 
                    type="number" 
                    step="0.01"
                    className="pl-10 h-12"
                    placeholder="0,00"
                    value={formData.dropshippingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, dropshippingPrice: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-muted/20 rounded-2xl border-2 border-dashed space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Controle de Estoque</Label>
                    <p className="text-xs text-muted-foreground">Gerenciar quantidade disponível automaticamente</p>
                  </div>
                  <Switch 
                    checked={formData.has_stock_control} 
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, has_stock_control: v }))} 
                  />
                </div>
                {formData.has_stock_control && (
                  <div className="space-y-2 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="stock">Quantidade em Estoque</Label>
                    <div className="flex items-center gap-3">
                      <Box className="w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="stock" 
                        type="number" 
                        className="h-10 w-32"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="min" className="text-base font-bold">Pedido Mínimo (Unidades)</Label>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="min" 
                    type="number"
                    className="h-12 w-32"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">* Quantidade mínima por pedido deste produto no atacado.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-bold">Tipo de Entrega</Label>
                  <Select value={formData.shipping_type} onValueChange={(v) => setFormData(prev => ({ ...prev, shipping_type: v }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Correios">Correios (PAC/SEDEX)</SelectItem>
                      <SelectItem value="Transportadora">Transportadora</SelectItem>
                      <SelectItem value="Retirada">Retirada em Mãos</SelectItem>
                      <SelectItem value="Proprio">Frota Própria</SelectItem>
                      <SelectItem value="Digital">Produto Digital (Download/E-mail)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20">
                  <div className="space-y-1">
                    <Label className="text-base font-bold text-primary">Pronta Entrega?</Label>
                    <p className="text-xs text-muted-foreground">Produto disponível para envio imediato</p>
                  </div>
                  <Switch 
                    checked={formData.readyToShip} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyToShip: checked }))} 
                  />
                </div>
              </div>

              <div className="space-y-6 p-6 bg-muted/20 rounded-2xl border">
                <Label className="text-base font-bold flex items-center gap-2">
                  <Ruler className="w-5 h-5" /> Peso & Dimensões (Opcional)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Peso (kg)</Label>
                    <Input 
                      type="number" 
                      step="0.001" 
                      placeholder="0.500" 
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Altura (cm)</Label>
                    <Input 
                      type="number" 
                      placeholder="10" 
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Largura (cm)</Label>
                    <Input 
                      type="number" 
                      placeholder="20" 
                      value={formData.width}
                      onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Profundidade (cm)</Label>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      value={formData.depth}
                      onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">Dados usados para cálculo de frete automático</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variations" className="space-y-8">
            <Card className="border-2 border-dashed bg-muted/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Boxes className="w-5 h-5" /> Configurar Variações
                </CardTitle>
                <CardDescription>Adicione cores, tamanhos ou outros atributos ao seu produto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Atributo (Ex: Cor, Tamanho)</Label>
                    <Input 
                      placeholder="Ex: Cor" 
                      value={variationName}
                      onChange={(e) => setVariationName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valores (Separados por vírgula)</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ex: Azul, Vermelho, Preto" 
                        value={variationValues}
                        onChange={(e) => setVariationValues(e.target.value)}
                      />
                      <Button 
                        type="button"
                        onClick={() => {
                          if (variationName && variationValues) {
                            const values = variationValues.split(',').map(v => v.trim()).filter(Boolean)
                            setFormData(prev => ({ 
                              ...prev, 
                              variations: [...prev.variations, { name: variationName, values }] 
                            }))
                            setVariationName('')
                            setVariationValues('')
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.variations.map((v, idx) => (
                    <div key={idx} className="p-4 bg-background border rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary mr-2">{v.name}:</span>
                        <span className="text-muted-foreground">{v.values.join(', ')}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          variations: prev.variations.filter((_, i) => i !== idx) 
                        }))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {formData.variations.length > 0 && (
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                    <p className="text-sm text-accent font-medium">
                      💡 Foram detectadas {formData.variations.length} tipos de variações. Os compradores poderão escolher estas opções na vitrine.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-8 border-t-2">
          <Button type="button" variant="ghost" size="lg" onClick={onClose}>Cancelar e Voltar</Button>
          <Button type="submit" size="lg" disabled={isLoading || uploadingImage} className="gap-2 px-12 h-14 text-lg">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {productId ? 'Salvar Alterações' : 'Finalizar Cadastro'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
