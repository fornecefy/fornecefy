import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Janeiro de 2024</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar a plataforma Fornecefy, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Fornecefy é uma plataforma B2B que conecta fornecedores e compradores do setor varejista. 
              Nosso serviço permite que fornecedores exibam seus produtos e que compradores encontrem e solicitem 
              orçamentos de mercadorias para revenda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cadastro e Conta</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para utilizar determinadas funcionalidades da plataforma, é necessário criar uma conta. 
              Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas 
              as atividades realizadas em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Uso da Plataforma</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Os usuários concordam em:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Não usar a plataforma para fins ilegais</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
              <li>Não tentar acessar áreas restritas do sistema</li>
              <li>Não enviar spam ou conteúdo malicioso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Transações Comerciais</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Fornecefy atua apenas como intermediário para conectar fornecedores e compradores. 
              As negociações, pagamentos e entregas são de responsabilidade exclusiva das partes envolvidas. 
              Não nos responsabilizamos por disputas comerciais entre usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo da plataforma, incluindo logos, textos, imagens e software, é protegido 
              por direitos autorais e de propriedade intelectual. É proibida a reprodução não autorizada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Fornecefy não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
              resultantes do uso ou da impossibilidade de uso da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Modificações dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
              em vigor após a publicação na plataforma. O uso continuado após as modificações constitui 
              aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: contato@fornecefy.com.br
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
