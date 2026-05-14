import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Janeiro de 2024</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone, CNPJ, endereço comercial</li>
              <li><strong>Dados de uso:</strong> páginas visitadas, produtos visualizados, tempo de navegação</li>
              <li><strong>Dados de dispositivo:</strong> tipo de navegador, sistema operacional, endereço IP</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Como Usamos suas Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar e facilitar transações na plataforma</li>
              <li>Enviar comunicações relevantes sobre nossos serviços</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Detectar e prevenir fraudes e abusos</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Podemos compartilhar suas informações nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Com fornecedores:</strong> quando você solicita um orçamento, compartilhamos suas informações de contato</li>
              <li><strong>Com prestadores de serviço:</strong> empresas que nos auxiliam na operação da plataforma</li>
              <li><strong>Por obrigação legal:</strong> quando exigido por lei ou autoridade competente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso 
              não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS para 
              transmissão de dados e armazenamento seguro em servidores protegidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
              <li>Revogar consentimento a qualquer momento</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos suas informações pelo tempo necessário para cumprir as finalidades descritas nesta 
              política, a menos que um período de retenção mais longo seja exigido por lei. Dados de contas 
              inativas podem ser excluídos após 2 anos de inatividade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas 
              por e-mail ou através de aviso em nossa plataforma. Recomendamos revisar esta página 
              regularmente para se manter informado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato com 
              nosso Encarregado de Proteção de Dados (DPO): privacidade@fornecefy.com.br
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
