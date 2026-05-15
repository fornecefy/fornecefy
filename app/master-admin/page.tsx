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
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Label } from '@/components/ui/label'
import { Header } from '@/components/header'
import { Plan } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState as useReactState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function MasterAdminPage() {
  const [searchTerm, setSearchTerm] = useReactState('')
  const [productSearchTerm, setProductSearchTerm] = useReactState('')
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useReactState(false)
  const [suppliers, setSuppliers] = useReactState<any[]>([])
  const [products, setProducts] = useReactState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useReactState(true)

  const MASTER_EMAIL = 'fornecefy@gmail.com'

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push('/login?redirect=/master-admin')
      } else if (user.email !== MASTER_EMAIL) {
        router.push('/')
      } else {
        setIsAuthorized(true)
        fetchAdminData()
      }
    }
  }, [user, isAuthLoading, router])

  const [admins, setAdmins] = useReactState<any[]>([])

  const fetchAdminData = async () => {
    setIsLoadingData(true)
    try {
      // Busca Perfis (Fornecedores e Admins)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('type', ['fornecedor', 'admin'])
      
      if (profileError) throw profileError

      // Busca Todos os Produtos
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (productError) throw productError

      if (profileData) {
        setSuppliers(profileData.filter(p => p.type === 'fornecedor'))
        setAdmins(profileData.filter(p => p.type === 'admin'))
      }
      if (productData) {
        setProducts(productData)
      }
    } catch (err) {
      console.error('Erro ao buscar dados do painel:', err)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verified: !currentStatus } : s))
    try {
      const { error } = await supabase.from('profiles').update({ verified: !currentStatus }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar fornecedor:', err)
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verified: currentStatus } : s))
    }
  }

  const handleUpdatePlan = async (id: string, newPlan: string) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, plan: newPlan } : s))
    try {
      const { error } = await supabase.from('profiles').update({ plan: newPlan }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar plano:', err)
      alert('Erro ao atualizar plano.')
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      alert('Erro ao atualizar status.')
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor? Todos os dados vinculados podem ser perdidos.')) return
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
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

  if (isAuthLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Master Admin</h1>
            <p className="text-muted-foreground">Gestão global do ecossistema Fornecefy</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchAdminData}>
              <BarChart3 className="w-4 h-4" />
              Sincronizar
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Cadastro
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-card border">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="gap-2">
              <Building2 className="w-4 h-4" />
              Fornecedores
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Equipe Interna
            </TabsTrigger>
            <TabsTrigger value="technical" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações Técnicas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs text-muted-foreground">Fornecedores cadastrados no sistema</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Produtos ativos no marketplace</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equipe Interna</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{admins.length}</div>
                  <p className="text-xs text-muted-foreground">Administradores e suporte</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Selo de Verificação</CardTitle>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {suppliers.filter(s => s.verified).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Fornecedores verificados</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações realizadas no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliers.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Novo fornecedor cadastrado: {s.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                    {products.slice(0, 2).map((p, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Novo produto adicionado: {p.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                    {suppliers.length === 0 && products.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">Nenhuma atividade recente registrada.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Atalhos para funções administrativas</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push('/dashboard')}>
                    <Building2 className="w-5 h-5" />
                    <span>Gerenciar Minha Loja</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={fetchAdminData}>
                    <Zap className="w-5 h-5" />
                    <span>Sincronizar Banco</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Logs de Segurança</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Target className="w-5 h-5" />
                    <span>Configurar Pixels</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Gestão de Fornecedores</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar fornecedor..."
                        className="pl-8 w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Selo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingData ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      suppliers
                        .filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-muted overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                                {s.logo_url ? (
                                  <img src={s.logo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (s.name || s.email || 'F')[0].toUpperCase()
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">{s.name || s.company_name || 'Sem Nome'}</span>
                                <span className="text-xs text-muted-foreground truncate">{s.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <select 
                              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                              value={s.plan || 'Básico'}
                              onChange={(e) => handleUpdatePlan(s.id, e.target.value)}
                            >
                              <option value="Básico">Básico</option>
                              <option value="Pro">Pro</option>
                              <option value="Elite">Elite</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            {s.verified ? (
                              <BadgeCheck className="w-5 h-5 text-primary cursor-pointer" onClick={() => handleToggleVerified(s.id, s.verified)} />
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleToggleVerified(s.id, !!s.verified)}>
                                Ativar
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <select 
                              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${s.status === 'blocked' ? 'text-destructive' : 'text-emerald-600'}`}
                              value={s.status || 'active'}
                              onChange={(e) => handleUpdateStatus(s.id, e.target.value)}
                            >
                              <option value="active">Ativo</option>
                              <option value="blocked">Bloqueado</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSupplier(s.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
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
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Gestão Global de Produtos</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produto ou SKU..."
                        className="pl-8 w-[250px]"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Preço (Varejo)</TableHead>
                      <TableHead>Preço (Atacado)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingData ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum produto cadastrado no sistema.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products
                        .filter(p => 
                          (p.name || '').toLowerCase().includes(productSearchTerm.toLowerCase()) || 
                          (p.sku || '').toLowerCase().includes(productSearchTerm.toLowerCase())
                        )
                        .map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                                {p.image_url ? (
                                  <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <span className="font-medium line-clamp-1">{p.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {p.sku || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {p.price ? `R$ ${p.price.toFixed(2)}` : 'Sob consulta'}
                          </TableCell>
                          <TableCell>
                            {p.wholesale_price ? `R$ ${p.wholesale_price.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>
                            <select 
                              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${p.status === 'active' ? 'text-emerald-600' : 'text-muted-foreground'}`}
                              value={p.status || 'active'}
                              onChange={(e) => handleUpdateProductStatus(p.id, e.target.value)}
                            >
                              <option value="active">Ativo</option>
                              <option value="inactive">Inativo</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
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
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipe Interna</CardTitle>
                <CardDescription>Gerencie administradores, suporte e vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membro</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Acesso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{admin.name || 'Admin'}</span>
                            <span className="text-xs text-muted-foreground">{admin.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-primary">Proprietário</Badge>
                        </TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <CardTitle>Pixels & Marketing</CardTitle>
                  </div>
                  <CardDescription>Configure rastreamento global ou por fornecedor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pixel do Facebook Global</Label>
                      <p className="text-xs text-muted-foreground">Ativa o rastreamento em toda a plataforma</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Google Analytics 4</Label>
                      <p className="text-xs text-muted-foreground">Monitoramento de tráfego avançado</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <CardTitle>Módulos de Pagamento</CardTitle>
                  </div>
                  <CardDescription>Controle de ferramentas de faturamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PIX Copia e Cola</Label>
                      <p className="text-xs text-muted-foreground">Habilitar módulo de pagamento instantâneo</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Link de Pagamento (Checkout)</Label>
                      <p className="text-xs text-muted-foreground">Permitir fechamento direto no site</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle>Recursos Experimentais</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <Label>Modo Manutenção</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <Label>Novas Modalidades</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <Label>Filtros AI</Label>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
