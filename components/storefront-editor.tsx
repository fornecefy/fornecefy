"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Upload, X, Save, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories, states, formatCurrency } from '@/lib/data'

interface StorefrontData {
  name: string
  logo: string
  coverImage: string
  bio: string
  minOrderValue: number
  state: string
  category: string
  whatsapp: string
  slug?: string
}

interface StorefrontEditorProps {
  initialData: StorefrontData
  onSave: (data: StorefrontData) => void
}

export function StorefrontEditor({ initialData, onSave }: StorefrontEditorProps) {
  const [data, setData] = useState<StorefrontData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setData(prev => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
        setData(prev => ({ ...prev, coverImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSave(data)
    setIsSaving(false)
  }

  const formatPhoneInput = (value: string | undefined | null) => {
    if (!value) return ''
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <div className="space-y-6">
      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Editar Vitrine</h2>
          <p className="text-sm text-muted-foreground">
            Personalize como sua loja aparece para os compradores
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Editar' : 'Visualizar'}
          </Button>
          <Button
            onClick={() => window.open(`/fornecedor/${data.slug || initialData.slug || initialData.name}`, '_blank')}
            variant="outline"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Visualizar Vitrine
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      {showPreview ? (
        // Preview Mode
        <Card className="bg-card border-border overflow-hidden">
          <div className="relative h-48 md:h-64 bg-muted">
            <Image
              src={coverPreview || data.coverImage || '/placeholder.jpg'}
              alt="Banner da vitrine"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-background bg-card overflow-hidden shadow-lg">
                <Image
                  src={logoPreview || data.logo || '/placeholder-logo.png'}
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">{data.name}</h3>
                <p className="text-muted-foreground">
                  {data.state} • {data.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Pedido Mínimo</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(data.minOrderValue)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-foreground mb-2">Sobre Nós</h4>
              <p className="text-muted-foreground">{data.bio}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <div className="grid gap-6">
          {/* Banner Upload */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Banner da Vitrine</CardTitle>
              <CardDescription>
                Imagem de capa que aparece no topo da sua página (recomendado: 1200x300px)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 md:h-64 bg-muted rounded-lg overflow-hidden group">
                <Image
                  src={coverPreview || data.coverImage || '/placeholder.jpg'}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => coverInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Alterar Banner
                  </Button>
                </div>
                {coverPreview && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setCoverPreview(null)
                      setData(prev => ({ ...prev, coverImage: initialData.coverImage }))
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Logo da Empresa</CardTitle>
              <CardDescription>
                Sua marca que aparece em cards e na vitrine (recomendado: 200x200px)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 rounded-lg bg-muted overflow-hidden group">
                  <Image
                    src={logoPreview || data.logo || '/placeholder-logo.png'}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Enviar Nova Logo
                  </Button>
                  {logoPreview && (
                    <Button
                      variant="ghost"
                      className="ml-2 text-destructive"
                      onClick={() => {
                        setLogoPreview(null)
                        setData(prev => ({ ...prev, logo: initialData.logo }))
                      }}
                    >
                      Remover
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Tamanho máximo de 2MB.
                  </p>
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Informações da Empresa</CardTitle>
              <CardDescription>
                Dados básicos que aparecem na sua vitrine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp para Contato</Label>
                  <Input
                    id="whatsapp"
                    value={formatPhoneInput(data.whatsapp)}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      whatsapp: e.target.value.replace(/\D/g, '') 
                    }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Personalizada (Slug)</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      fornecefy.com/fornecedor/
                    </span>
                    <Input
                      id="slug"
                      className="pl-[165px]"
                      value={data.slug || ''}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        setData(prev => ({ ...prev, slug: val }))
                      }}
                      placeholder="minha-loja"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Use apenas letras minúsculas, números e hífens.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={data.state}
                    onValueChange={(value) => setData(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={data.category}
                    onValueChange={(value) => setData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Pedido Mínimo (R$)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    value={data.minOrderValue}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      minOrderValue: Number(e.target.value) 
                    }))}
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Sobre a Empresa</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Descreva sua empresa, produtos e diferenciais..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {(data.bio || '').length}/500 caracteres
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
