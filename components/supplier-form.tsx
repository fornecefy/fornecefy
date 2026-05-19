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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Lock, Layout, MapPin as MapPinIcon, ShieldCheck, CreditCard } from 'lucide-react'

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
    company_name: '',
    whatsapp: '',
    state: '',
    city: '',
    plan: 'Básico',
    status: 'approved',
    logo: '',
    verified_badge: false,
    description: '',
    user_id: '',
    features: { online_payment: false }
  })

  // Password change state (for Admin)
  const [adminNewPassword, setAdminNewPassword] = useState('')
  const [isAdminUpdatingPassword, setIsAdminUpdatingPassword] = useState(false)
  const [adminPasswordError, setAdminPasswordError] = useState('')
  const [adminPasswordSuccess, setAdminPasswordSuccess] = useState('')

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
          company_name: data.company_name || '',
          whatsapp: data.whatsapp || '',
          state: data.state || '',
          city: data.city || '',
          plan: data.plan || 'Básico',
          status: data.status || 'approved',
          logo: data.company_logo_url || '',
          verified_badge: data.verified_badge || false,
          description: data.description || '',
          user_id: data.user_id || data.auth_user_id || '',
          features: data.social_links?.features || { online_payment: false }
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
        // Buscar social_links atual para preservar dados existentes
        const { data: currentData } = await supabase.from('suppliers').select('social_links').eq('id', supplierId).single()
        const existingSocialLinks = currentData?.social_links || {}
        
        const { error: dbError } = await supabase
          .from('suppliers')
          .update({
            name: formData.name,
            company_name: formData.company_name,
            whatsapp: formData.whatsapp,
            state: formData.state,
            city: formData.city,
            plan: formData.plan,
            status: formData.status,
            company_logo_url: formData.logo,
            verified_badge: formData.verified_badge,
            description: formData.description,
            social_links: {
              ...existingSocialLinks,
              features: formData.features
            }
          })
          .eq('id', supplierId)
        
        if (dbError) throw dbError
      } else {
        // Criar novo fornecedor
        const { error: dbError } = await supabase
          .from('suppliers')
          .insert([{
            name: formData.name,
            company_name: formData.company_name,
            whatsapp: formData.whatsapp,
            state: formData.state,
            city: formData.city,
            plan: formData.plan,
            status: formData.status,
            company_logo_url: formData.logo,
            verified_badge: formData.verified_badge,
            description: formData.description,
            social_links: { features: formData.features },
            slug: formData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
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

  const handleAdminPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminNewPassword || adminNewPassword.length < 6) {
      setAdminPasswordError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsAdminUpdatingPassword(true)
    setAdminPasswordError('')
    setAdminPasswordSuccess('')

    try {
      const res = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: formData.user_id, 
          newPassword: adminNewPassword 
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar senha')
      
      setAdminPasswordSuccess('Senha do fornecedor atualizada com sucesso!')
      setAdminNewPassword('')
    } catch (err: any) {
      setAdminPasswordError(err.message)
    } finally {
      setIsAdminUpdatingPassword(false)
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

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg gap-2">
              <Layout className="w-4 h-4" /> Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="plan" className="rounded-lg gap-2">
              <MapPinIcon className="w-4 h-4" /> Endereço & Plano
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-lg gap-2">
              <CreditCard className="w-4 h-4" /> Recursos
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2">
              <Lock className="w-4 h-4" /> Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-10">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Logo Section */}
              <div className="flex flex-col items-center gap-4">
                <Label className="text-base font-bold">Logotipo da Empresa</Label>
                <div className="relative w-48 h-48 rounded-2xl border-4 border-dashed border-muted-foreground/10 flex items-center justify-center overflow-hidden bg-muted hover:border-primary/40 transition-all cursor-pointer group">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
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
                    <Label htmlFor="company_name" className="text-base font-bold">Nome da Empresa</Label>
                    <div className="relative">
                      <Input id="company_name" className="pl-10 h-12" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} required />
                      <Building2 className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-bold">E-mail</Label>
                    <div className="relative">
                      <Input id="email" className="pl-10 h-12" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} readOnly={!!supplierId} />
                      <Mail className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="whatsapp" className="text-base font-bold">Telefone / WhatsApp</Label>
                    <div className="relative">
                      <Input id="whatsapp" className="pl-10 h-12" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                      <Phone className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-10">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-bold">Estado</Label>
                <Select value={formData.state} onValueChange={v => setFormData({...formData, state: v})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZIL_STATES.map(state => (
                      <SelectItem key={state.value} value={state.label}>{state.label}</SelectItem>
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
                  checked={formData.verified_badge} 
                  onChange={e => setFormData({...formData, verified_badge: e.target.checked})}
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
          </TabsContent>

          <TabsContent value="features" className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-6 bg-blue-500/5 rounded-2xl border-2 border-dashed border-blue-500/20">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    id="online_payment" 
                    className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer" 
                    checked={formData.features.online_payment} 
                    onChange={e => setFormData({
                      ...formData, 
                      features: { ...formData.features, online_payment: e.target.checked }
                    })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="online_payment" className="cursor-pointer font-bold text-lg text-blue-700 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Ativar Pagamento Online
                  </Label>
                  <p className="text-muted-foreground mt-1">Ao ativar, o fornecedor terá acesso a configurar seu próprio meio de pagamento (Mercado Pago ou PIX Manual) e receber via PIX com checkout transparente diretamente no site.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-10">
            <Card className="border-none shadow-none bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Redefinir Senha do Fornecedor</CardTitle>
                <CardDescription>Como administrador, você pode forçar uma nova senha para este usuário.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md space-y-4">
                  {adminPasswordError && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {adminPasswordError}
                    </div>
                  )}
                  {adminPasswordSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {adminPasswordSuccess}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-password">Nova Senha Temporária</Label>
                    <Input
                      id="admin-new-password"
                      type="password"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="h-12"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAdminPasswordUpdate}
                    disabled={isAdminUpdatingPassword || !adminNewPassword || !formData.user_id}
                    className="w-full h-12"
                  >
                    {isAdminUpdatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-2" />
                    )}
                    Redefinir Senha Agora
                  </Button>
                  {!formData.user_id && (
                    <p className="text-[10px] text-destructive font-medium italic">
                      * Este fornecedor não possui um ID de usuário vinculado no banco de dados.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
