"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, Eye, EyeOff, Loader2, Building2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth, UserType } from '@/lib/auth-context'
import { BRAZIL_STATES } from '@/lib/constants'

import { Suspense } from 'react'

function CadastroContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo') as UserType | null
  const { register } = useAuth()
  
  const [step, setStep] = useState<'type' | 'form'>(tipoParam ? 'form' : 'type')
  const [userType, setUserType] = useState<UserType | null>(tipoParam)
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>(tipoParam === 'fornecedor' ? 'cnpj' : 'cpf')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    cnpj: '',
    state: '',
  })

  useEffect(() => {
    if (tipoParam) {
      setUserType(tipoParam)
      setDocumentType(tipoParam === 'fornecedor' ? 'cnpj' : 'cpf')
      setStep('form')
    }
  }, [tipoParam])

  const handleSelectType = (type: UserType) => {
    setUserType(type)
    setDocumentType(type === 'fornecedor' ? 'cnpj' : 'cpf')
    setStep('form')
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const formatDocument = (value: string, type: 'cpf' | 'cnpj') => {
    const numbers = value.replace(/\D/g, '')
    
    if (type === 'cpf') {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14)
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .substring(0, 18)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    const { success, error } = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      type: userType!,
      company: formData.company,
      phone: formData.phone,
      cnpj: formData.cnpj,
      state: formData.state,
    })
    
    if (success) {
      router.push(userType === 'fornecedor' ? '/planos' : '/minha-conta')
    } else {
      setError(error || 'Erro ao realizar cadastro')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(500px_300px_at_top,transparent_20%,white)] pointer-events-none" />
      
      {/* Header simples */}
      <header className="relative z-10 py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Fornecefy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 relative z-10">
        {step === 'type' ? (
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Crie sua conta</h1>
              <p className="text-lg text-muted-foreground">Escolha o seu perfil para começarmos</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/40 group"
                onClick={() => handleSelectType('fornecedor')}
              >
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Sou Fornecedor</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Quero vender meus produtos em atacado
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Crie sua vitrine virtual
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Receba contatos direto no WhatsApp
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Aumente suas vendas
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                    Começar como Fornecedor
                  </Button>
                </CardFooter>
              </Card>

              <Card 
                className="cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/40 group"
                onClick={() => handleSelectType('comprador')}
              >
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-accent/30 transition-all">
                    <ShoppingBag className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Sou Comprador</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Quero encontrar os melhores fornecedores
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" /> Encontre milhares de produtos
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" /> Compare preços de atacado
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" /> Salve seus fornecedores favoritos
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full h-12 rounded-xl font-bold hover:bg-accent/80">
                    Começar como Comprador
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Já tem conta?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        ) : (
          <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`p-2 rounded-full ${userType === 'fornecedor' ? 'bg-primary/10' : 'bg-accent/20'}`}>
                  {userType === 'fornecedor' ? (
                    <Building2 className="w-5 h-5 text-primary" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-accent-foreground" />
                  )}
                </div>
                <span className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                  {userType === 'fornecedor' ? 'Perfil Fornecedor' : 'Perfil Comprador'}
                </span>
              </div>
              <CardTitle className="text-3xl font-black">Preencha seus dados</CardTitle>
              <CardDescription>
                Preencha os dados para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nome da empresa</Label>
                  <Input
                    id="company"
                    placeholder="Sua empresa"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Documento</Label>
                    <Select value={documentType} onValueChange={(value: 'cpf' | 'cnpj') => { setDocumentType(value); handleChange('cnpj', '') }} disabled={userType === 'fornecedor'}>
                      <SelectTrigger id="documentType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">{documentType === 'cpf' ? 'Número do CPF' : 'Número do CNPJ'}</Label>
                    <Input
                      id="cnpj"
                      placeholder={documentType === 'cpf' ? "000.000.000-00" : "00.000.000/0000-00"}
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', formatDocument(e.target.value, documentType))}
                      maxLength={documentType === 'cpf' ? 14 : 18}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                      maxLength={15}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZIL_STATES.map(state => (
                          <SelectItem key={state.value} value={state.label}>{state.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Ao criar sua conta, você concorda com nossos{' '}
                  <Link href="/politicas/termos-de-uso" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link href="/politicas/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>.
                </p>

                <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    userType === 'fornecedor' ? 'Continuar para os Planos' : 'Criar minha conta'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border/40 pt-6">
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => {
                  setStep('type')
                  setUserType(null)
                }}
              >
                Voltar e escolher outro tipo
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Já tem conta?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <CadastroContent />
    </Suspense>
  )
}
