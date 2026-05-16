"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Footer() {
  const [footerLogo, setFooterLogo] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await supabase.from('platform_settings').select('value').eq('key', 'footer_logo_url').single()
        if (data?.value) setFooterLogo(data.value)
      } catch (err) {
        // Silencioso
      }
    }
    fetchLogo()
  }, [])

  return (
    <footer className="bg-background border-t border-border/50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {footerLogo ? (
                <img src={footerLogo} alt="Fornecefy" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Package className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-foreground">Fornecefy</span>
                </>
              )}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              O ecossistema B2B definitivo que conecta fornecedores e lojistas em todo o Brasil. Simplificando orçamentos, estoque e logística em um só lugar.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Marketplace</h3>
            <ul className="space-y-4">
              {[
                { label: 'Início', href: '/' },
                { label: 'Categorias', href: '/categorias' },
                { label: 'Favoritos', href: '/favoritos' },
                { label: 'Blog da Fornecefy', href: '/blog' },
                { label: 'Central de Ajuda', href: '/ajuda' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Para Empresas</h3>
            <ul className="space-y-4">
              {[
                { label: 'Seja um Fornecedor', href: '/cadastro?tipo=fornecedor' },
                { label: 'Acessar Dashboard', href: '/dashboard' },
                { label: 'Como Funciona', href: '/como-funciona' },
                { label: 'Nossos Planos', href: '/planos' },
                { label: 'Solicitar Orçamento', href: '/carrinho' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Atendimento</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">E-mail</p>
                  <p className="text-sm text-foreground">contato@fornecefy.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Telefone</p>
                  <p className="text-sm text-foreground">(11) 98765-4321</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Endereço</p>
                  <p className="text-sm text-foreground">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies and Copyright */}
        <div className="border-t border-border mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              <Link href="/politicas/termos-de-uso" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link>
              <Link href="/politicas/privacidade" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidade</Link>
              <Link href="/politicas/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
              <Link href="/politicas/devolucao" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Devoluções</Link>
            </div>
            <p className="text-xs text-muted-foreground order-last md:order-none">
              &copy; {new Date().getFullYear()} <span className="font-bold text-foreground">Fornecefy</span>. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for payment/security icons if needed */}
               <div className="h-6 w-10 bg-muted rounded" />
               <div className="h-6 w-10 bg-muted rounded" />
               <div className="h-6 w-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

