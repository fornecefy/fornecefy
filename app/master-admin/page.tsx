"use client"

import { useState } from 'react'
import { 
  Users, 
  Building2, 
  Settings, 
  Search, 
  Filter, 
  BadgeCheck, 
  ShieldCheck, 
  Star, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Plus,
  BarChart3,
  CheckCircle2,
  XCircle,
  Zap,
  CreditCard,
  Target,
  Trash2,
  Pencil,
  Package,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  TrendingUp,
  AlertCircle,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Header } from '@/components/header'
import { Plan } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState as useReactState } from 'react'
import { supabase } from '@/lib/supabase'
import { SupplierForm } from '@/components/supplier-form'
import { ProductForm } from '@/components/product-form'
import { BlogPostForm } from '@/components/blog-post-form'

export default function MasterAdminPage() {
  const [activeSection, setActiveSection] = useReactState('dashboard')
  const [subView, setSubView] = useReactState<'list' | 'edit-supplier' | 'new-supplier' | 'edit-product' | 'new-product' | 'edit-blog' | 'new-blog'>('list')
  const [blogPosts, setBlogPosts] = useReactState<any[]>([])
  const [searchTerm, setSearchTerm] = useReactState('')
  const [productSearchTerm, setProductSearchTerm] = useReactState('')
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useReactState(false)
  const [suppliers, setSuppliers] = useReactState<any[]>([])
  const [products, setProducts] = useReactState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useReactState(true)

  // Modal states (using subView now)
  const [editingId, setEditingId] = useReactState<string | undefined>(undefined)
  const [initialSupplierId, setInitialSupplierId] = useReactState<string | undefined>(undefined)

  const [platformSettings, setPlatformSettings] = useReactState({
    header_logo_url: '',
    footer_logo_url: ''
  })
  const [isSavingSettings, setIsSavingSettings] = useReactState(false)

  // Admin password change state
  const [adminNewSelfPassword, setAdminNewSelfPassword] = useReactState('')
  const [isAdminUpdatingSelfPassword, setIsAdminUpdatingSelfPassword] = useReactState(false)
  const [adminSelfPasswordError, setAdminSelfPasswordError] = useReactState('')
  const [adminSelfPasswordSuccess, setAdminSelfPasswordSuccess] = useReactState('')

  const MASTER_EMAIL = 'fornecefy@gmail.com'
  useEffect(() => {
    console.log('MasterAdmin useEffect:', { isAuthLoading, user: user?.email, isAuthorized })
    if (isAuthLoading) return // Aguarda auth carregar
    
    if (!user) {
      console.log('MasterAdmin: Sem usuário logado, redirecionando para login...')
      router.push('/login?redirect=/master-admin')
      return
    }
    
    if (user.email.toLowerCase() !== MASTER_EMAIL.toLowerCase()) {
      console.log('MasterAdmin: Usuário não é admin:', user.email)
      router.push('/')
      return
    }
    
    console.log('MasterAdmin: Acesso autorizado! Carregando dados...')
    setIsAuthorized(true)
    fetchAdminData()
    fetchPlatformSettings()
  }, [user, isAuthLoading])

  const fetchPlatformSettings = async () => {
    try {
      const { data, error } = await supabase.from('platform_settings').select('*')
      if (error) return // Silencioso se a tabela não existir
      if (data) {
        const settings: any = {}
        data.forEach(s => { settings[s.key] = s.value })
        setPlatformSettings({
          header_logo_url: settings.header_logo_url || '',
          footer_logo_url: settings.footer_logo_url || ''
        })
      }
    } catch (err) {
      // Ignora erro de tabela inexistente
    }
  }

  const handleUploadBranding = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData })
      const data = await res.json()
      if (data.url) {
        setPlatformSettings(prev => ({ ...prev, [key]: data.url }))
      }
    } catch (err) {
      alert('Erro no upload')
    }
  }

  const savePlatformSettings = async () => {
    setIsSavingSettings(true)
    try {
      const updates = [
        { key: 'header_logo_url', value: platformSettings.header_logo_url },
        { key: 'footer_logo_url', value: platformSettings.footer_logo_url }
      ]

      const { error } = await supabase.from('platform_settings').upsert(updates)
      if (error) throw error
      alert('Identidade visual atualizada com sucesso!')
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setIsSavingSettings(false)
    }
  }

  const [admins, setAdmins] = useReactState<any[]>([])

  const fetchAdminData = async () => {
    setIsLoadingData(true)
    try {
      // Busca Fornecedores da tabela dedicada
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true })
      
      if (supplierError) throw supplierError

      // Busca Perfis Administrativos (Tentativa segura sem a coluna 'role' que pode estar ausente)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)
      
      if (profileError && profileError.code !== '42703') {
        console.warn('Erro ao buscar perfis:', profileError.message)
      }

      // Busca Todos os Produtos
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (productError) throw productError

      // Busca Blog
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (blogError) throw blogError

      if (supplierData) setSuppliers(supplierData)
      if (profileData) setAdmins(profileData)
      if (productData) setProducts(productData)
      if (blogData) setBlogPosts(blogData)
    } catch (err: any) {
      console.error('Erro ao buscar dados do painel:', err)
      alert('Erro ao carregar dados do banco: ' + (err.message || 'Erro desconhecido'))
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleAdminSelfPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminNewSelfPassword || adminNewSelfPassword.length < 6) {
      setAdminSelfPasswordError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsAdminUpdatingSelfPassword(true)
    setAdminSelfPasswordError('')
    setAdminSelfPasswordSuccess('')

    try {
      const { error } = await supabase.auth.updateUser({ password: adminNewSelfPassword })
      if (error) throw error
      setAdminSelfPasswordSuccess('Sua senha de administrador foi atualizada!')
      setAdminNewSelfPassword('')
    } catch (err: any) {
      setAdminSelfPasswordError(err.message)
    } finally {
      setIsAdminUpdatingSelfPassword(false)
    }
  }

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verified: !currentStatus } : s))
    try {
      const { error } = await supabase.from('suppliers').update({ verified: !currentStatus }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar fornecedor:', err)
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verified: currentStatus } : s))
    }
  }

  const handleUpdatePlan = async (id: string, newPlan: string) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, plan: newPlan } : s))
    try {
      const { error } = await supabase.from('suppliers').update({ plan: newPlan }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar plano:', err)
      alert('Erro ao atualizar plano.')
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    try {
      const { error } = await supabase.from('suppliers').update({ status: newStatus }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      alert('Erro ao atualizar status.')
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor? Todos os dados vinculados podem ser perdidos.')) return
    
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', id)
      if (error) throw error
      setSuppliers(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Erro ao deletar fornecedor:', err)
      alert('Erro ao excluir fornecedor.')
    }
  }

  const handleUpdateProductStatus = async (id: string, newStatus: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    try {
      const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar status do produto:', err)
      alert('Erro ao atualizar status do produto.')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Erro ao deletar produto:', err)
      alert('Erro ao excluir produto.')
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return
    
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setBlogPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Erro ao deletar artigo:', err)
      alert('Erro ao excluir artigo.')
    }
  }

  if (isAuthLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: BarChart3 },
    { id: 'suppliers', label: 'Fornecedores', icon: Building2 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'blog', label: 'Blog / Notícias', icon: TrendingUp },
    { id: 'team', label: 'Equipe Interna', icon: Users },
    { id: 'technical', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="w-6 h-6" />
            <span>Master Admin</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">Fornecefy Ecosystem</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setSubView('list')
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Super Admin</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/')}>
            <ExternalLink className="w-4 h-4" />
            Voltar ao Site
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg capitalize">{activeSection.replace('-', ' ')}</h2>
            {subView !== 'list' && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">{subView.replace('-', ' ')}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={fetchAdminData} disabled={isLoadingData}>
              <Zap className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </Button>
            <div className="h-8 w-px bg-border mx-2" />
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
              Meu Painel
            </Button>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* VISÃO GERAL */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardDescription>Fornecedores</CardDescription>
                    <CardTitle className="text-3xl font-black">{suppliers.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      Ativos na plataforma
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Produtos Ativos</CardDescription>
                    <CardTitle className="text-3xl font-black">{products.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Em {suppliers.length} catálogos</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Equipe Interna</CardDescription>
                    <CardTitle className="text-3xl font-black">{admins.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Controle de acesso total</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-accent/5">
                  <CardHeader className="pb-2">
                    <CardDescription>Leads Gerados</CardDescription>
                    <CardTitle className="text-3xl font-black text-accent">--</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Módulo em desenvolvimento</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Novos Fornecedores</CardTitle>
                    <CardDescription>Últimos cadastros realizados na plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suppliers.slice(0, 5).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                              {s.company_logo_url ? <img src={s.company_logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{s.name}</p>
                              <p className="text-xs text-muted-foreground">{s.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{s.plan}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Atalhos Rápidos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start gap-2 h-12 rounded-xl" onClick={() => { setActiveSection('suppliers'); setSubView('new-supplier'); }}>
                      <Plus className="w-4 h-4" />
                      Novo Fornecedor
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl" onClick={() => { setActiveSection('technical'); }}>
                      <ImageIcon className="w-4 h-4" />
                      Alterar Logo
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl" onClick={() => { setActiveSection('products'); }}>
                      <Search className="w-4 h-4" />
                      Buscar Produto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

           {/* FORNECEDORES */}
          {activeSection === 'suppliers' && (
            <div className="space-y-6">
              {subView === 'list' ? (
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Gestão de Fornecedores</CardTitle>
                        <CardDescription>Visualize e controle todos os parceiros da plataforma</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Buscar empresa, email..." 
                            className="pl-9 w-[300px] h-10 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button className="gap-2 rounded-xl h-10 px-6" onClick={() => setSubView('new-supplier')}>
                          <Plus className="w-4 h-4" />
                          Novo
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[300px]">Empresa</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingData ? (
                          <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                        ) : suppliers.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="h-64 text-center text-muted-foreground font-medium">Nenhum fornecedor encontrado.</TableCell></TableRow>
                        ) : (
                          suppliers
                            .filter(s => 
                              (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((s) => (
                            <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl border bg-card flex items-center justify-center overflow-hidden shadow-sm">
                                    {s.company_logo_url ? <img src={s.company_logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-muted-foreground" />}
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sm">{s.name}</span>
                                      {s.verified && <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />}
                                    </div>
                                    <span className="text-[11px] text-muted-foreground">{s.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{s.city || 'Cidade N/I'}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase">{s.state || 'UF'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <select 
                                  className="bg-muted px-2 py-1 rounded-md text-xs font-bold focus:outline-none border-none"
                                  value={s.plan || 'Básico'}
                                  onChange={(e) => handleUpdatePlan(s.id, e.target.value)}
                                >
                                  <option value="Básico">Básico</option>
                                  <option value="Pro">Pro</option>
                                  <option value="Premium">Premium</option>
                                  <option value="Elite">Elite</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                <Badge variant={s.status === 'approved' ? 'default' : 'destructive'} className="rounded-full text-[10px]">
                                  {s.status === 'approved' ? 'Ativo' : s.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                                    onClick={() => {
                                      setEditingId(s.id)
                                      setSubView('edit-supplier')
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSupplier(s.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (subView === 'edit-supplier' || subView === 'new-supplier') ? (
                <div className="max-w-4xl mx-auto">
                  <SupplierForm 
                    supplierId={subView === 'edit-supplier' ? editingId : undefined}
                    onClose={() => setSubView('list')}
                    onSuccess={() => {
                      fetchAdminData()
                      setSubView('list')
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* PRODUTOS */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              {subView === 'list' ? (
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Gestão de Produtos</CardTitle>
                        <CardDescription>Produtos listados por todos os fornecedores</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Buscar produto, SKU..." 
                            className="pl-9 w-[300px] h-10 rounded-xl"
                            value={productSearchTerm}
                            onChange={(e) => setProductSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button className="gap-2 rounded-xl h-10 px-6" onClick={() => setSubView('new-product')}>
                          <Plus className="w-4 h-4" />
                          Novo
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[350px]">Produto</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Preço (Atacado)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingData ? (
                          <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                        ) : products.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="h-64 text-center text-muted-foreground font-medium">Nenhum produto cadastrado.</TableCell></TableRow>
                        ) : (
                          products
                            .filter(p => 
                              (p.name || '').toLowerCase().includes(productSearchTerm.toLowerCase()) || 
                              (p.sku || '').toLowerCase().includes(productSearchTerm.toLowerCase())
                            )
                            .map((p) => (
                            <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl border bg-card flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain" /> : <Package className="w-6 h-6 text-muted-foreground" />}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm truncate">{p.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">SKU: {p.sku || '---'}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <Badge variant="secondary" className="text-[10px] w-fit">{p.category}</Badge>
                                  <span className="text-[9px] text-muted-foreground mt-1">{p.subcategory || 'Sem subcat.'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-sm">
                                R$ {p.wholesale_price?.toFixed(2) || '0.00'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={p.status === 'active' ? 'outline' : 'secondary'} className={p.status === 'active' ? 'border-emerald-500 text-emerald-600' : ''}>
                                  {p.status === 'active' ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                                    onClick={() => {
                                      setEditingId(p.id)
                                      setSubView('edit-product')
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(p.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (subView === 'edit-product' || subView === 'new-product') ? (
                <div className="max-w-4xl mx-auto">
                  <ProductForm 
                    productId={subView === 'edit-product' ? editingId : undefined}
                    onClose={() => setSubView('list')}
                    onSuccess={() => {
                      fetchAdminData()
                      setSubView('list')
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* EQUIPE */}
          {activeSection === 'team' && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Equipe Interna</CardTitle>
                <CardDescription>Usuários com acesso administrativo ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {admins.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                          {admin.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{admin.name || 'Administrador'}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Super Admin</Badge>
                    </div>
                  ))}
                  <button className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-muted-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-bold">Adicionar Membro</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BLOG */}
          {activeSection === 'blog' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
                <div>
                  <h3 className="text-xl font-bold">Postagens do Blog</h3>
                  <p className="text-sm text-muted-foreground">Gerencie o conteúdo educativo e notícias da plataforma</p>
                </div>
                <Button className="rounded-xl gap-2 font-bold h-12 px-6" onClick={() => { setSubView('new-blog'); setEditingId(undefined) }}>
                  <Plus className="w-5 h-5" />
                  Novo Artigo
                </Button>
              </div>

              {subView === 'list' ? (
                <div className="grid gap-4">
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="border-none shadow-sm overflow-hidden group hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-6 p-4">
                        <div className="w-24 h-16 rounded-lg bg-muted overflow-hidden border flex-shrink-0">
                          {post.cover_image ? <img src={post.cover_image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground m-auto" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold truncate">{post.title}</h4>
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-[10px] uppercase font-black">
                              {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                            <span>{post.category}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(post.id); setSubView('edit-blog') }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteBlogPost(post.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {blogPosts.length === 0 && (
                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border/60">
                      <TrendingUp className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Nenhum artigo publicado ainda.</p>
                      <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setSubView('new-blog')}>Começar agora</Button>
                    </div>
                  )}
                </div>
              ) : (
                <BlogPostForm 
                  postId={editingId} 
                  onClose={() => { setSubView('list'); setEditingId(undefined) }}
                  onSuccess={() => { fetchAdminData(); setSubView('list'); setEditingId(undefined) }}
                />
              )}
            </div>
          )}

          {/* CONFIGURAÇÕES */}
          {activeSection === 'technical' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm h-fit">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <CardTitle>Identidade Visual</CardTitle>
                  </div>
                  <CardDescription>Configure os logotipos oficiais da Fornecefy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold">Logo do Cabeçalho (Light/Dark)</Label>
                    <div className="relative h-24 w-full rounded-2xl border-2 border-dashed border-muted-foreground/10 bg-muted/30 flex items-center justify-center overflow-hidden group">
                      {platformSettings.header_logo_url ? (
                        <img src={platformSettings.header_logo_url} className="h-12 w-auto object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium italic">Nenhum logotipo enviado</span>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleUploadBranding(e, 'header_logo_url')} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold">Logo do Rodapé</Label>
                    <div className="relative h-24 w-full rounded-2xl border-2 border-dashed border-muted-foreground/10 bg-muted/30 flex items-center justify-center overflow-hidden group">
                      {platformSettings.footer_logo_url ? (
                        <img src={platformSettings.footer_logo_url} className="h-12 w-auto object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium italic">Nenhum logotipo enviado</span>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleUploadBranding(e, 'footer_logo_url')} />
                    </div>
                  </div>

                  <Button onClick={savePlatformSettings} disabled={isSavingSettings} className="w-full h-12 rounded-xl gap-2 font-bold">
                    {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm h-fit">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle>Recursos da Plataforma</CardTitle>
                  </div>
                  <CardDescription>Controle de módulos e acesso global</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Modo Manutenção</Label>
                      <p className="text-xs text-muted-foreground">Bloqueia acesso público ao site</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Novos Cadastros</Label>
                      <p className="text-xs text-muted-foreground">Permite que novos fornecedores se registrem</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Filtros Avançados AI</Label>
                      <p className="text-xs text-muted-foreground">Ativa busca inteligente no marketplace</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm h-fit">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <CardTitle>Minha Segurança</CardTitle>
                  </div>
                  <CardDescription>Altere sua senha de acesso ao Master Admin</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminSelfPasswordUpdate} className="space-y-4">
                    {adminSelfPasswordError && (
                      <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        {adminSelfPasswordError}
                      </div>
                    )}
                    {adminSelfPasswordSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm">
                        {adminSelfPasswordSuccess}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-self-password">Nova Senha Master</Label>
                      <Input
                        id="admin-self-password"
                        type="password"
                        value={adminNewSelfPassword}
                        onChange={(e) => setAdminNewSelfPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isAdminUpdatingSelfPassword || !adminNewSelfPassword}
                      className="w-full h-12 rounded-xl gap-2 font-bold"
                    >
                      {isAdminUpdatingSelfPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      Atualizar Minha Senha
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
