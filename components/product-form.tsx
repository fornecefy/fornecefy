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
  ArrowLeft
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
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

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
    supplier_id: initialSupplierId || user?.id
  })

  const selectedCategoryData = CATEGORIES.find(c => c.name === formData.category)

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
          supplier_id: data.supplier_id
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
      const productData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        wholesale_price: parseFloat(formData.wholesalePrice),
        retail_price: formData.retailPrice ? parseFloat(formData.retailPrice) : null,
        dropshipping_price: formData.dropshippingPrice ? parseFloat(formData.dropshippingPrice) : null,
        min_quantity: parseInt(formData.minQuantity),
        ready_to_ship: formData.readyToShip,
        image_url: formData.image,
        gallery_urls: formData.gallery,
        sku: formData.sku,
        video_url: formData.videoUrl,
        supplier_id: formData.supplier_id,
        modalities: formData.modalities,
        status: 'active'
      }

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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Images */}
          <div className="space-y-8">
            <div>
              <Label className="text-base font-bold mb-4 block">Imagem Principal</Label>
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
                      Remover Foto
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-4 border-dashed border-muted-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                  {uploadingImage ? (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-2" />
                      <span className="text-sm font-medium">Subindo imagem...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <span className="text-lg font-bold">Upload da Foto</span>
                      <span className="text-sm text-muted-foreground mt-1">Arraste ou clique para selecionar</span>
                      <span className="text-[11px] text-muted-foreground/50 mt-4 px-4 py-1 bg-muted rounded-full uppercase tracking-wider font-semibold">JPG, PNG ou WebP • Máx 1MB</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              )}
            </div>

            <div>
              <Label className="text-base font-bold mb-4 block">Fotos Adicionais (Até 4)</Label>
              <div className="grid grid-cols-4 gap-4">
                {formData.gallery.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(url, true)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {formData.gallery.length < 4 && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="space-y-8">
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-bold">Categoria</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v, subcategory: '' }))}>
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="subcategory" className="text-base font-bold">Subcategoria</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subcategory: v }))}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="subcategory" className="h-12">
                    <SelectValue placeholder={formData.category ? "Selecione" : "Escolha a categoria primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategoryData?.subcategories.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
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
                <Label htmlFor="min" className="text-base font-bold">Qtd Mínima</Label>
                <Input 
                  id="min" 
                  type="number"
                  className="h-12"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                  required
                />
              </div>
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

            <div className="space-y-3">
              <Label htmlFor="desc" className="text-base font-bold">Descrição do Produto</Label>
              <Textarea 
                id="desc" 
                rows={6} 
                className="resize-none"
                placeholder="Descreva materiais, cores, tamanhos e diferenciais..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2 border-dashed">
              <div className="space-y-1">
                <Label className="text-base font-bold">Disponibilidade Imediata?</Label>
                <p className="text-sm text-muted-foreground">O produto está pronto para envio (Pronta Entrega)</p>
              </div>
              <Switch 
                checked={formData.readyToShip} 
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyToShip: checked }))} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

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
