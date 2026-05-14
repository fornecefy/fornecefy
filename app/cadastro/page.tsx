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
import { states } from '@/lib/data'

import { Suspense } from 'react'

function CadastroContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo') as UserType | null
  const { register } = useAuth()
  
  const [step, setStep] = useState<'type' | 'form'>(tipoParam ? 'form' : 'type')
  const [userType, setUserType] = useState<UserType | null>(tipoParam)
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
      setStep('form')
    }
  }, [tipoParam])

  const handleSelectType = (type: UserType) => {
    setUserType(type)
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

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
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

    const success = await register({
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
      router.push(userType === 'fornecedor' ? '/dashboard' : '/')
    } else {
      setError('Este e-mail já está cadastrado')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header simples */}
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Fornecefy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        {step === 'type' ? (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Criar uma conta</h1>
              <p className="text-muted-foreground">Escolha como você quer usar o Fornecefy</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleSelectType('fornecedor')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Sou Fornecedor</CardTitle>
                  <CardDescription>
                    Quero vender meus produtos para lojistas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Crie sua vitrine virtual</li>
                    <li>Receba leads qualificados</li>
                    <li>Negocie diretamente via WhatsApp</li>
                    <li>Gerencie seus produtos e pedidos</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Cadastrar como Fornecedor</Button>
                </CardFooter>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleSelectType('comprador')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle>Sou Comprador</CardTitle>
                  <CardDescription>
                    Quero encontrar fornecedores para minha loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Encontre milhares de produtos</li>
                    <li>Compare preços de atacado</li>
                    <li>Solicite orçamentos fácil</li>
                    <li>Salve seus favoritos</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">Cadastrar como Comprador</Button>
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
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {userType === 'fornecedor' ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-accent-foreground" />
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  {userType === 'fornecedor' ? 'Conta Fornecedor' : 'Conta Comprador'}
                </span>
              </div>
              <CardTitle className="text-2xl">Criar sua conta</CardTitle>
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
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
                      maxLength={18}
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
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
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
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CadastroContent />
    </Suspense>
  )
}
