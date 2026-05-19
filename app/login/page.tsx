"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

import { Suspense } from 'react'

function LoginContent() {
  const { user, login, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!isAuthLoading && user) {
      console.log('Login: Usuário já logado, redirecionando...', user.email)
      if (user.email.toLowerCase() === 'fornecefy@gmail.com') {
        router.replace('/master-admin')
      } else if (user.type === 'fornecedor') {
        router.replace('/dashboard')
      } else if (user.type === 'comprador') {
        router.replace('/minha-conta')
      } else {
        router.replace(redirect)
      }
    }
  }, [user, isAuthLoading, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { success, error, userType } = await login(email, password)
    console.log('Login attempt result:', { success, userType, error })
    
    if (success) {
      console.log('Login successful, determining redirect...')
      if (email.toLowerCase() === 'fornecefy@gmail.com') {
        console.log('Redirecting to master-admin')
        router.replace('/master-admin')
      } else if (userType === 'fornecedor') {
        console.log('Redirecting to dashboard')
        router.replace('/dashboard')
      } else if (userType === 'comprador') {
        console.log('Redirecting to minha-conta')
        router.replace('/minha-conta')
      } else {
        console.log('Redirecting to fallback:', redirect)
        router.replace(redirect)
      }
      // NÃO resetar isLoading aqui — a navegação vai desmontar este componente
    } else {
      console.warn('Login failed:', error)
      setError(error || 'E-mail ou senha inválidos')
      setIsLoading(false)
    }
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

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-black">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-base mt-2">
              Acesse sua conta para continuar
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
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex justify-end">
                <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>


          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/40 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Ainda não tem conta?{' '}
              <Link href="/cadastro" className="text-primary font-medium hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
