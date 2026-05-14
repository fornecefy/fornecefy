import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function SegurancaPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Segurança de Dados</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Janeiro de 2024</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <p className="text-muted-foreground leading-relaxed text-lg">
              A segurança dos seus dados é nossa prioridade. Implementamos múltiplas camadas de proteção 
              para garantir que suas informações estejam sempre seguras em nossa plataforma.
            </p>
          </section>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 my-8">
            <div className="bg-muted rounded-lg p-4 flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Criptografia SSL/TLS</h3>
                <p className="text-sm text-muted-foreground">Todas as comunicações são protegidas com criptografia de ponta a ponta.</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Servidores Seguros</h3>
                <p className="text-sm text-muted-foreground">Infraestrutura em data centers certificados com redundância.</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Monitoramento 24/7</h3>
                <p className="text-sm text-muted-foreground">Sistemas de detecção de intrusão e monitoramento contínuo.</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Firewall Avançado</h3>
                <p className="text-sm text-muted-foreground">Proteção contra ataques DDoS e tentativas de invasão.</p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Medidas Técnicas de Segurança</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Criptografia:</strong> Todos os dados sensíveis são criptografados em trânsito (SSL/TLS) e em repouso (AES-256)</li>
              <li><strong>Autenticação:</strong> Senhas são armazenadas usando hash bcrypt com salt</li>
              <li><strong>Backups:</strong> Backups automáticos diários com retenção de 30 dias</li>
              <li><strong>Atualizações:</strong> Patches de segurança aplicados regularmente</li>
              <li><strong>Testes:</strong> Testes de penetração e auditorias de segurança periódicas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Controle de Acesso</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Implementamos controles rígidos de acesso aos dados:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Princípio do menor privilégio para funcionários</li>
              <li>Autenticação de dois fatores para acesso administrativo</li>
              <li>Registro de todas as ações em logs de auditoria</li>
              <li>Revisão periódica de permissões de acesso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Conformidade e Certificações</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Nossa plataforma está em conformidade com:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>LGPD:</strong> Lei Geral de Proteção de Dados (Lei 13.709/2018)</li>
              <li><strong>Marco Civil da Internet:</strong> Lei 12.965/2014</li>
              <li><strong>PCI-DSS:</strong> Padrões de segurança para dados de cartão (quando aplicável)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Resposta a Incidentes</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Mantemos um plano de resposta a incidentes que inclui:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Equipe dedicada de resposta a incidentes</li>
              <li>Procedimentos documentados para diferentes cenários</li>
              <li>Comunicação transparente com usuários afetados</li>
              <li>Notificação à ANPD quando exigido por lei</li>
              <li>Análise pós-incidente e melhorias contínuas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Dicas de Segurança para Usuários</h2>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">Use senhas fortes com pelo menos 8 caracteres, incluindo letras, números e símbolos</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">Não compartilhe suas credenciais de acesso com terceiros</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">Desconfie de e-mails solicitando dados sensíveis - nunca pedimos senha por e-mail</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">Mantenha seu navegador e sistema operacional atualizados</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">Sempre verifique se está no site oficial (fornecefy.com.br) antes de fazer login</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Reportar Vulnerabilidades</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 mb-2">
                    Se você descobrir uma vulnerabilidade de segurança em nossa plataforma, pedimos que nos 
                    informe de forma responsável.
                  </p>
                  <p className="text-sm text-amber-800">
                    <strong>Contato:</strong> seguranca@fornecefy.com.br
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre segurança de dados, entre em contato com nossa equipe: seguranca@fornecefy.com.br
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
