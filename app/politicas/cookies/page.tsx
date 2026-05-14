import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Política de Cookies</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Janeiro de 2024</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. O que são Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita 
              nosso site. Eles nos ajudam a entender como você usa nossa plataforma, lembrar suas 
              preferências e melhorar sua experiência de navegação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Tipos de Cookies que Utilizamos</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies Essenciais</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Necessários para o funcionamento básico do site. Sem eles, certas funcionalidades não funcionariam.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Autenticação e login</li>
              <li>Carrinho de orçamento</li>
              <li>Preferências de idioma</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies de Desempenho</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Coletam informações sobre como os visitantes usam nosso site.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Páginas mais visitadas</li>
              <li>Mensagens de erro</li>
              <li>Tempo de carregamento</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies de Funcionalidade</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Permitem que o site lembre de escolhas que você faz.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Produtos favoritos</li>
              <li>Filtros de busca</li>
              <li>Histórico de navegação</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Cookies de Marketing</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Usados para exibir anúncios relevantes para você.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Remarketing</li>
              <li>Análise de conversão</li>
              <li>Personalização de anúncios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies de Terceiros</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Utilizamos serviços de terceiros que também podem instalar cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Google Analytics:</strong> análise de tráfego e comportamento</li>
              <li><strong>Google Ads:</strong> remarketing e conversões</li>
              <li><strong>Meta Pixel:</strong> análise de campanhas em redes sociais</li>
              <li><strong>Hotjar:</strong> mapas de calor e gravações de sessão</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Como Gerenciar Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Você pode controlar e gerenciar cookies de várias formas:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Configurações do navegador:</strong> a maioria dos navegadores permite bloquear ou excluir cookies</li>
              <li><strong>Banner de cookies:</strong> ao visitar nosso site, você pode aceitar ou recusar cookies não essenciais</li>
              <li><strong>Ferramentas de opt-out:</strong> serviços como Google oferecem opções para desativar rastreamento</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Observe que desabilitar certos cookies pode afetar a funcionalidade do site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Período de Retenção</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os cookies têm diferentes períodos de validade:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li><strong>Cookies de sessão:</strong> expiram ao fechar o navegador</li>
              <li><strong>Cookies persistentes:</strong> permanecem por até 2 anos, dependendo da finalidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Atualizações desta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas 
              ou por requisitos legais. A data da última atualização será sempre indicada no topo da página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre nossa política de cookies, entre em contato: privacidade@fornecefy.com.br
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
