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
  Target
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
import { suppliers, Plan } from '@/lib/data'

export default function MasterAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
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
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-card border">
            <TabsTrigger value="suppliers" className="gap-2">
              <Building2 className="w-4 h-4" />
              Fornecedores
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
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
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
                      <TableHead>Modalidades</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-muted overflow-hidden">
                              <img src={s.logo} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.plan === 'Elite' ? 'default' : 'secondary'}>
                            {s.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {s.verified ? (
                            <BadgeCheck className="w-5 h-5 text-primary" />
                          ) : (
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              Ativar
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {s.modalities.length} ativas
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    <TableRow>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">Master Admin</span>
                          <span className="text-xs text-muted-foreground">admin@fornecefy.com.br</span>
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
                    <TableRow>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">Suporte Técnico</span>
                          <span className="text-xs text-muted-foreground">suporte@fornecefy.com.br</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Suporte</Badge>
                      </TableCell>
                      <TableCell>Limitado</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
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
