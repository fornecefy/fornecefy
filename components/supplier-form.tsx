"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Mail,
  Phone,
  FileText,
  Globe,
  MapPin,
  ArrowLeft,
  BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

import { BRAZIL_STATES } from '@/lib/constants'

interface SupplierFormProps {
  supplierId?: string
  onClose: () => void
  onSuccess: () => void
}

export function SupplierForm({ supplierId, onClose, onSuccess }: SupplierFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    trade_name: '',
    whatsapp: '',
    state: '',
    city: '',
    plan: 'Básico',
    status: 'approved',
    logo: '',
    verified: false,
    description: ''
  })

  useEffect(() => {
    if (supplierId) {
      fetchSupplier()
    }
  }, [supplierId])

  const fetchSupplier = async () => {
    setIsFetching(true)
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          trade_name: data.trade_name || '',
          whatsapp: data.whatsapp || '',
          state: data.state || '',
          city: data.city || '',
          plan: data.plan || 'Básico',
          status: data.status || 'approved',
          logo: data.company_logo_url || '',
          verified: data.verified || false,
          description: data.description || ''
        })
      }
    } catch (err: any) {
      setError('Erro ao buscar dados do fornecedor: ' + err.message)
    } finally {
      setIsFetching(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
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
        setFormData(prev => ({ ...prev, logo: data.url }))
      } else {
        setError(data.error || 'Erro no upload')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor de upload')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (supplierId) {
        const { error: dbError } = await supabase
          .from('suppliers')
          .update({
            name: formData.name,
            trade_name: formData.trade_name,
            whatsapp: formData.whatsapp,
            state: formData.state,
            city: formData.city,
            plan: formData.plan,
            status: formData.status,
            company_logo_url: formData.logo,
            verified: formData.verified,
            description: formData.description
          })
          .eq('id', supplierId)
        
        if (dbError) throw dbError
      } else {
        // Criar novo fornecedor
        const { error: dbError } = await supabase
          .from('suppliers')
          .insert([{
            name: formData.name,
            trade_name: formData.trade_name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            state: formData.state,
            city: formData.city,
            plan: formData.plan,
            status: formData.status,
            company_logo_url: formData.logo,
            verified: formData.verified,
            description: formData.description,
            slug: formData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u0300]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
          }])
        
        if (dbError) throw dbError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError('Erro ao salvar: ' + err.message)
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
          <h2 className="text-2xl font-bold">{supplierId ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h2>
          <p className="text-sm text-muted-foreground">Gerencie as informações principais do fornecedor</p>
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

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <Label className="text-base font-bold">Logotipo da Empresa</Label>
            <div className="relative w-48 h-48 rounded-2xl border-4 border-dashed border-muted-foreground/10 flex items-center justify-center overflow-hidden bg-muted hover:border-primary/40 transition-all cursor-pointer group">
              {formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-muted-foreground" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                CLIQUE PARA ALTERAR
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleUpload} />
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Recomendado: 400x400px (PNG ou JPG)</p>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-bold">Nome do Responsável</Label>
                <div className="relative">
                  <Input id="name" className="pl-10 h-12" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  <Mail className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="company" className="text-base font-bold">Nome da Empresa</Label>
                <div className="relative">
                  <Input id="company" className="pl-10 h-12" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                  <Building2 className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="cnpj" className="text-base font-bold">CNPJ</Label>
                <div className="relative">
                  <Input id="cnpj" className="pl-10 h-12" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                  <FileText className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-bold">Telefone / WhatsApp</Label>
                <div className="relative">
                  <Input id="phone" className="pl-10 h-12" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <Phone className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-bold">Estado</Label>
                <Select value={formData.state} onValueChange={v => setFormData({...formData, state: v})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZIL_STATES.map(state => (
                      <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="city" className="text-base font-bold">Cidade</Label>
                <Input id="city" className="h-12" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Digite a cidade" />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-bold">Plano Atual</Label>
                <Select value={formData.plan} onValueChange={v => setFormData({...formData, plan: v})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20">
              <div className="flex items-center h-5">
                <input 
                  type="checkbox" 
                  id="verified" 
                  className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" 
                  checked={formData.verified} 
                  onChange={e => setFormData({...formData, verified: e.target.checked})}
                />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="verified" className="cursor-pointer font-bold text-lg text-primary flex items-center gap-2">
                  <BadgeCheck className="w-6 h-6" />
                  Fornecedor Verificado (Selo Blue)
                </Label>
                <p className="text-muted-foreground">Exibe o selo de confiança e prioriza o fornecedor nas buscas.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t-2">
          <Button type="button" variant="ghost" size="lg" onClick={onClose}>Cancelar</Button>
          <Button type="submit" size="lg" disabled={isLoading} className="gap-2 px-12 h-14 text-lg">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
