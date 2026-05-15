"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
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
    <footer className="bg-background border-t border-border/50 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {footerLogo ? (
                <img src={footerLogo} alt="Fornecefy" className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">Fornecefy</span>
                </>
              )}
            </Link>
            <p className="text-sm text-muted-foreground">
              O marketplace B2B que conecta fornecedores e lojistas em todo o Brasil.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Carrinho de Orçamento
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Área do Fornecedor
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Empresas */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Para Empresas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cadastro?tipo=fornecedor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seja um Fornecedor
                </Link>
              </li>
              <li>
                <Link href="/cadastro?tipo=comprador" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cadastre-se como Comprador
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Planos e Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/politicas/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politicas/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/politicas/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/politicas/devolucao" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Devolução
                </Link>
              </li>
              <li>
                <Link href="/politicas/seguranca" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Segurança de Dados
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Fornecefy. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/ajuda" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Central de Ajuda
            </Link>
            <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
