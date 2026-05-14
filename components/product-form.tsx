"use client"

import { useState } from 'react'
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
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

interface ProductFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function ProductForm({ onClose, onSuccess }: ProductFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: '',
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
    modalities: ['Atacado'] as string[]
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      setError('A imagem principal é obrigatória')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            category: formData.category,
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
            supplier_id: user?.id,
            modalities: formData.modalities,
            status: 'active'
          }
        ])

      if (dbError) throw dbError

      onSuccess()
      onClose()
    } catch (err: any) {
      setError('Erro ao salvar produto: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Cadastrar Novo Produto</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Images */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Imagem Principal (Máx 1MB)</Label>
                {formData.image ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Clique para fazer upload</span>
                        <span className="text-[10px] text-muted-foreground/60 mt-1">JPG, PNG ou WebP</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Galeria (Até 4 fotos)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-5 w-5"
                        onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {formData.gallery.length < 4 && (
                    <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/10 hover:border-primary/30 cursor-pointer">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Camiseta Oversized Algodão"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moda Feminina">Moda Feminina</SelectItem>
                      <SelectItem value="Moda Masculina">Moda Masculina</SelectItem>
                      <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                      <SelectItem value="Cosméticos">Cosméticos</SelectItem>
                      <SelectItem value="Alimentos">Alimentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Ref</Label>
                  <Input 
                    id="sku" 
                    placeholder="Ref: 123"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wholesale">Preço Atacado</Label>
                  <Input 
                    id="wholesale" 
                    type="number" 
                    step="0.01"
                    placeholder="R$ 0,00"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, wholesalePrice: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retail">Preço Varejo</Label>
                  <Input 
                    id="retail" 
                    type="number" 
                    step="0.01"
                    placeholder="R$ 0,00"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, retailPrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min">Qtd Mínima</Label>
                  <Input 
                    id="min" 
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Descrição Completa</Label>
                <Textarea 
                  id="desc" 
                  rows={4} 
                  placeholder="Detalhes sobre o material, tamanhos, cores..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Link Vídeo (YouTube)</Label>
                <Input 
                  id="video" 
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="space-y-0.5">
                  <Label>Pronta Entrega?</Label>
                  <p className="text-[10px] text-muted-foreground">O produto será enviado imediatamente</p>
                </div>
                <Switch 
                  checked={formData.readyToShip} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyToShip: checked }))} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" size="lg" disabled={isLoading || uploadingImage} className="gap-2 px-8">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizar Cadastro
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
