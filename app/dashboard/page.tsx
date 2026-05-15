"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Users,
  User,
  CreditCard,
  Eye,
  MessageCircle,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Menu,
  X,
  Store,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StorefrontEditor } from '@/components/storefront-editor'
import { ProductForm } from '@/components/product-form'
import { dashboardMetrics, leads, formatCurrency } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  { id: 'vitrine', label: 'Vitrine', icon: Store },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'plano', label: 'Plano', icon: CreditCard },
]

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('vitrine')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  const [currentSupplier, setCurrentSupplier] = useState<any>(null)
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login?redirect=/dashboard')
      return
    }
    if (user?.id) {
      fetchSupplierData()
    }
  }, [user, isAuthLoading])

  const fetchSupplierData = async () => {
    setIsDataLoading(true)
    try {
      // Perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (profile) {
        setCurrentSupplier(profile)
      }

      // Produtos
      const { data: prods, error: prodsError } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', user?.id)
      
      if (prods) {
        setSupplierProducts(prods)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleStorefrontSave = async (formData: any) => {
    setIsDataLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          logo_url: formData.logo,
          cover_url: formData.coverImage,
          bio: formData.bio,
          min_order_value: formData.minOrderValue,
          state: formData.state,
          category: formData.category,
          phone: formData.whatsapp,
          slug: formData.slug
        })
        .eq('id', user?.id)

      if (error) throw error
      
      setCurrentSupplier(prev => ({ ...prev, ...formData }))
      await fetchSupplierData()
    } catch (err: any) {
      console.error('Erro ao salvar vitrine:', err)
      alert('Erro ao salvar as alterações da vitrine.')
    } finally {
      setIsDataLoading(false)
    }
  }

  if (isAuthLoading || !user || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Garantir que temos um objeto mínimo mesmo se for novo
  const supplier = currentSupplier || {
    id: user.id,
    name: user.name || 'Nova Loja',
    logo: '',
    coverImage: '',
    bio: '',
    minOrderValue: 0,
    state: user.state || '',
    category: '',
    whatsapp: user.phone || '',
    slug: '',
    plan: 'Básico'
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">Fornecefy</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                        transition-colors
                        ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* View Storefront & Back */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Link href={`/fornecedor/${currentSupplier.id}`} target="_blank">
              <Button variant="outline" className="w-full gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent">
                <ExternalLink className="w-4 h-4" />
                Ver Minha Vitrine
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-4"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Dashboard do Fornecedor
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Metrics Cards - Always visible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Cliques no WhatsApp
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      0
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span>0% este mes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Visualizacoes da Vitrine
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      0
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span>0% este mes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total de Leads
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      0
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span>0% este mes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Content */}
          {activeSection === 'vitrine' && (
            <StorefrontEditor
              initialData={{
                name: currentSupplier.name || '',
                logo: currentSupplier.logo || '',
                coverImage: currentSupplier.coverImage || '',
                bio: currentSupplier.bio || '',
                minOrderValue: currentSupplier.minOrderValue || 0,
                state: currentSupplier.state || '',
                category: currentSupplier.category || 'Geral',
                whatsapp: currentSupplier.whatsapp || '',
                slug: currentSupplier.slug || '',
              }}
              onSave={handleStorefrontSave}
            />
          )}

          {activeSection === 'produtos' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Meus Produtos</CardTitle>
                    <CardDescription>
                      Gerencie os produtos da sua vitrine
                    </CardDescription>
                  </div>
                   <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsAddingProduct(true)}
                  >
                    Adicionar Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Preco
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Modalidades
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-4">
                            <span className="font-medium text-foreground block">
                              {product.name}
                            </span>
                            {product.sku && <span className="text-[10px] text-muted-foreground">SKU: {product.sku}</span>}
                          </td>
                          <td className="py-3 px-4 text-foreground">
                            <div className="text-sm font-semibold">{formatCurrency(product.wholesalePrice)}</div>
                            <div className="text-[10px] text-muted-foreground">Mín: {product.minQuantity} un.</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {product.modalities.map(mod => (
                                <Badge key={mod} variant="secondary" className="text-[10px] px-1 h-4 font-normal">
                                  {mod}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={product.readyToShip ? 'default' : 'outline'}
                              className={product.readyToShip ? 'bg-accent text-accent-foreground' : ''}
                            >
                              {product.readyToShip ? 'Pronta Entrega' : 'Sob Encomenda'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'leads' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Ultimos Leads</CardTitle>
                <CardDescription>
                  Contatos interessados nos seus produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Nenhum lead ainda
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Quando lojistas entrarem em contato ou solicitarem orçamentos, eles aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'perfil' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Perfil da Empresa</CardTitle>
                <CardDescription>
                  Informacoes exibidas na sua vitrine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome da Empresa
                    </label>
                    <p className="text-muted-foreground">{currentSupplier.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Estado
                    </label>
                    <p className="text-muted-foreground">{currentSupplier.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Categoria
                    </label>
                    <p className="text-muted-foreground">{currentSupplier.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pedido Minimo
                    </label>
                    <p className="text-muted-foreground">
                      {formatCurrency(currentSupplier.minOrderValue)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sobre Nos
                    </label>
                    <p className="text-muted-foreground">{currentSupplier.bio}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveSection('vitrine')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'plano' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                  <CardDescription>
                    Seu plano e recursos disponiveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <BadgeCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Plano {currentSupplier.plan}</p>
                      <p className="text-sm text-muted-foreground">Ativo desde Jan 2024</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Modalidades permitidas: <span className="font-semibold text-foreground">
                        {currentSupplier.plan === 'Básico' ? '1 modalidade' : 
                         currentSupplier.plan === 'Pro' ? '2 modalidades' : 
                         'Ilimitadas'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Produtos: <span className="font-semibold text-foreground">Ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Selo de Verificado: <span className="font-semibold text-foreground">Ativo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

               <Card className="bg-primary/5 border-primary/20 flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-primary">Upgrade para Elite</CardTitle>
                      <CardDescription>
                        Desbloqueie todo o potencial
                      </CardDescription>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">RECOMENDADO</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-primary">
                      R$ 297<span className="text-lg font-normal text-muted-foreground">/mes</span>
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Modalidades Ilimitadas
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Destaque na Home do Marketplace
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Prioridade Máxima no Suporte
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Exportação de Relatórios Avançados
                    </li>
                  </ul>
                  <Button className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground py-6">
                    Fazer Upgrade Agora
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {isAddingProduct && (
        <ProductForm 
          onClose={() => setIsAddingProduct(false)} 
          onSuccess={() => {
            // Recarregar dados ou mostrar toast
            console.log('Produto cadastrado!')
          }} 
        />
      )}
    </div>
  )
}
