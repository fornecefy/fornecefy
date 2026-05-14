import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function DevolucaoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Política de Devolução</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Janeiro de 2024</p>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Importante:</strong> O Fornecefy é uma plataforma que conecta fornecedores e compradores. 
              As políticas de devolução são definidas individualmente por cada fornecedor. Abaixo estão as 
              diretrizes gerais que recomendamos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Diretrizes Gerais</h2>
            <p className="text-muted-foreground leading-relaxed">
              Recomendamos que fornecedores e compradores acordem os termos de devolução antes de finalizar 
              qualquer transação. Cada fornecedor deve informar claramente sua política de devolução em 
              sua página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Direito de Arrependimento</h2>
            <p className="text-muted-foreground leading-relaxed">
              De acordo com o Código de Defesa do Consumidor (Art. 49), o comprador tem direito de desistir 
              da compra em até 7 dias corridos após o recebimento do produto, sem necessidade de justificativa, 
              quando a compra for realizada fora do estabelecimento comercial.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Nota:</strong> Em transações B2B entre empresas, este direito pode não se aplicar. 
              Consulte seu advogado para orientação específica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Produtos com Defeito</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Em caso de produtos com defeito de fabricação:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>O comprador deve notificar o fornecedor em até 30 dias para produtos não duráveis</li>
              <li>O comprador deve notificar o fornecedor em até 90 dias para produtos duráveis</li>
              <li>O fornecedor tem 30 dias para resolver o problema</li>
              <li>Se não resolvido, o comprador pode optar por troca, restituição ou abatimento proporcional</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Condições para Devolução</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Para que a devolução seja aceita, geralmente recomendamos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Produto na embalagem original, sem indícios de uso</li>
              <li>Todos os acessórios e manuais inclusos</li>
              <li>Nota fiscal ou comprovante de compra</li>
              <li>Comunicação prévia ao fornecedor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Custos de Devolução</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os custos de frete para devolução devem ser acordados entre as partes. Em casos de defeito 
              de fabricação, recomendamos que o fornecedor arque com os custos. Em caso de arrependimento, 
              os custos geralmente ficam por conta do comprador, salvo acordo diferente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Prazo para Reembolso</h2>
            <p className="text-muted-foreground leading-relaxed">
              Após o recebimento e verificação do produto devolvido, o reembolso deve ser processado em 
              até 30 dias. O valor será devolvido pelo mesmo método de pagamento utilizado na compra, 
              salvo acordo diferente entre as partes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Produtos Não Aceitos para Devolução</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Alguns produtos podem não ser aceitos para devolução, como:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Produtos personalizados ou feitos sob medida</li>
              <li>Produtos perecíveis ou com validade curta</li>
              <li>Produtos de higiene pessoal já abertos</li>
              <li>Produtos danificados por mau uso do comprador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Resolução de Conflitos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Em caso de disputas entre fornecedores e compradores, recomendamos primeiro tentar uma 
              solução amigável. O Fornecefy pode intermediar comunicações, mas não se responsabiliza 
              pela resolução de conflitos comerciais entre as partes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para reportar problemas ou solicitar suporte: suporte@fornecefy.com.br
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
