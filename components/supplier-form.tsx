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
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

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
    company: '',
    phone: '',
    cnpj: '',
    state: '',
    plan: 'Básico',
    status: 'active',
    logo_url: '',
    verified: false
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
        .from('profiles')
        .select('*')
        .eq('id', supplierId)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          company: data.company || '',
          phone: data.phone || '',
          cnpj: data.cnpj || '',
          state: data.state || '',
          plan: data.plan || 'Básico',
          status: data.status || 'active',
          logo_url: data.logo_url || '',
          verified: data.verified || false
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
        setFormData(prev => ({ ...prev, logo_url: data.url }))
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
        // Update
        const { error: dbError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            company: formData.company,
            phone: formData.phone,
            cnpj: formData.cnpj,
            state: formData.state,
            plan: formData.plan,
            status: formData.status,
            logo_url: formData.logo_url,
            verified: formData.verified
          })
          .eq('id', supplierId)
        
        if (dbError) throw dbError
      } else {
        // Create is more complex because it needs Auth creation. 
        // For admin, we might want to just create the profile if user exists, 
        // but usually we want to invite them. 
        // For now, let's focus on EDITING since the user asked for that.
        setError('A criação de novos fornecedores deve ser feita via página de cadastro por segurança.')
        setIsLoading(false)
        return
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError('Erro ao salvar: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">{supplierId ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isFetching ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden bg-muted hover:border-primary/50 transition-all cursor-pointer">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleUpload} />
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Logotipo da Empresa</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Responsável</Label>
                <div className="relative">
                  <Input id="name" className="pl-9" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Nome da Empresa</Label>
                <div className="relative">
                  <Input id="company" className="pl-9" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="relative">
                  <Input id="cnpj" className="pl-9" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <div className="relative">
                  <Input id="phone" className="pl-9" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.state} onValueChange={v => setFormData({...formData, state: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    {/* ... Adicionar outros depois ... */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Select value={formData.plan} onValueChange={v => setFormData({...formData, plan: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <input 
                type="checkbox" 
                id="verified" 
                className="w-4 h-4 accent-primary" 
                checked={formData.verified} 
                onChange={e => setFormData({...formData, verified: e.target.checked})}
              />
              <Label htmlFor="verified" className="cursor-pointer font-medium text-primary">Fornecedor Verificado (Selo Blue)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="gap-2 px-8">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
