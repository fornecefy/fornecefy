"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Store, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Package,
  MapPin,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function BuyerProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('pedidos')

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login')
    return null
  }

  // Mock data for display
  const orders = []
  const favoriteStores = []

  const menuItems = [
    { id: 'pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'lojas', label: 'Lojas que Sigo', icon: Store },
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground leading-tight">{user.name}</h2>
                    <p className="text-xs text-muted-foreground">{user.type === 'comprador' ? 'Comprador' : 'Fornecedor'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? 'block' : 'hidden md:block'}`} />
                  </button>
                )
              })}
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                Sair da Conta
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'pedidos' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>Acompanhe o status das suas compras</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {/* List orders here */}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Nenhum pedido ainda</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Você ainda não realizou nenhum pedido no Fornecefy.
                      </p>
                      <Link href="/">
                        <Button>Explorar Marketplace</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'favoritos' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Produtos Favoritos</CardTitle>
                  <CardDescription>Produtos que você salvou para ver depois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Sua lista está vazia</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Favorite produtos para encontrá-los facilmente aqui.
                    </p>
                    <Link href="/">
                      <Button>Ver Produtos</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'lojas' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Lojas que Sigo</CardTitle>
                  <CardDescription>Fornecedores que você acompanha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Nenhuma loja seguida</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Siga seus fornecedores favoritos para receber atualizações.
                    </p>
                    <Link href="/">
                      <Button>Descobrir Fornecedores</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'perfil' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Seus dados cadastrais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                      <p className="text-foreground">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                      <p className="text-foreground">{user.company || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                      <p className="text-foreground">{user.cnpj || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Estado</p>
                      <p className="text-foreground">{user.state || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{user.phone || '-'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
