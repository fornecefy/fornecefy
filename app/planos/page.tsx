"use client"

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLAN_DETAILS, formatCurrency } from '@/lib/data'
import { Check, Zap, Star, ShieldCheck, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function PlansPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const handlePlanClick = (planId: string, price: number) => {
    if (isLoading) return
    
    if (user) {
      if (price === 0) {
        router.push('/dashboard')
      } else {
        // Redireciona para o pagamento (pode ser /pagamento ou /dashboard com parâmetro)
        router.push(`/pagamento?plano=${planId}`)
      }
    } else {
      router.push('/cadastro?tipo=fornecedor')
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-primary/5">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
          
          <div className="container relative mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary uppercase tracking-widest font-bold">
              Planos & Preços
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
              Acelere suas vendas no <span className="text-primary">Atacado</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Escolha o plano ideal para o momento da sua empresa. Deixe sua marca em destaque e conecte-se com milhares de lojistas em todo o Brasil.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLAN_DETAILS.map((plan) => (
              <div 
                key={plan.id}
                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.highlight 
                    ? 'bg-card border-primary/50 shadow-xl shadow-primary/10 ring-2 ring-primary/20 scale-105 z-10' 
                    : 'bg-card/50 border-border/40'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.id === 'Básico' && <Zap className="w-5 h-5 text-muted-foreground" />}
                    {plan.id === 'Pro' && <Star className="w-5 h-5 text-blue-500" />}
                    {plan.id === 'Premium' && <ShieldCheck className="w-5 h-5 text-primary" />}
                    {plan.id === 'Elite' && <Rocket className="w-5 h-5 text-purple-500" />}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{formatCurrency(plan.price)}</span>
                    {plan.price > 0 && <span className="text-muted-foreground text-sm">/mês</span>}
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full p-0.5 ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.highlight ? 'default' : 'outline'} 
                  className={`w-full rounded-xl py-6 font-bold text-base transition-all ${
                    plan.highlight 
                      ? 'shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handlePlanClick(plan.id, plan.price)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Section (Simplified) */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes</h2>
            <p className="text-muted-foreground">Tudo o que você precisa saber sobre os nossos planos.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
              <h4 className="font-bold mb-2">Posso mudar de plano a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">Sim! Você pode fazer o upgrade ou downgrade do seu plano diretamente pelo seu painel de controle a qualquer momento.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
              <h4 className="font-bold mb-2">Quais as formas de pagamento?</h4>
              <p className="text-sm text-muted-foreground">Aceitamos cartões de crédito, PIX e boleto bancário para todos os planos pagos.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
              <h4 className="font-bold mb-2">Existe fidelidade nos contratos?</h4>
              <p className="text-sm text-muted-foreground">Não. Nossos planos são mensais e você pode cancelar quando quiser, sem taxas de cancelamento.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/40">
              <h4 className="font-bold mb-2">Como funciona o selo de verificado?</h4>
              <p className="text-sm text-muted-foreground">O selo é concedido após nossa equipe validar seus documentos e garantir a segurança para os compradores da plataforma.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
