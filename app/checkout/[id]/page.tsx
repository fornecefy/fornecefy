"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  MapPin, 
  QrCode, 
  Store,
  CheckCircle2,
  Copy,
  AlertCircle,
  MessageCircle,
  User
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatCurrency } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supplierId = use(params).id
  const { items, getItemsBySupplier, getSupplierTotal, clearSupplierItems, generateWhatsAppMessage } = useCart()
  const { user } = useAuth()
  
  const [supplier, setSupplier] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1) // 1: Resumo/Endereço, 2: Pagamento
  
  const [buyerName, setBuyerName] = useState('')
  const [isAddressCombined, setIsAddressCombined] = useState(false)

  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  })

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setBuyerName(user.user_metadata.name)
    }
  }, [user])

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const { data } = await supabase
          .from('suppliers')
          .select('*')
          .or(`id.eq.${supplierId},user_id.eq.${supplierId}`)
          .single()
        
        if (data) {
          setSupplier(data)
        }
      } catch (error) {
        console.error('Erro ao buscar fornecedor:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplier()
  }, [supplierId])

  const supplierItems = getItemsBySupplier().get(supplierId) || []
  const total = getSupplierTotal(supplierId)

  // Redirect to cart if empty
  useEffect(() => {
    if (!isLoading && supplierItems.length === 0 && !orderSuccess) {
      router.push('/carrinho')
    }
  }, [supplierItems, isLoading, orderSuccess, router])

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    setAddressData(prev => ({ ...prev, cep }))

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          setAddressData(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleManualPaymentSubmit = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate API call to register order
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setOrderSuccess(true)
      clearSupplierItems(supplierId)
      
    } catch (err) {
      alert('Erro ao processar o pedido. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMercadoPagoSubmit = async () => {
    setIsProcessing(true)
    
    try {
      // Aqui integrariamos a API do Mercado Pago Checkout Transparente.
      // Por enquanto, apenas simulamos o sucesso do pedido.
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setOrderSuccess(true)
      clearSupplierItems(supplierId)
      
    } catch (err) {
      alert('Erro ao processar o pagamento.')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para a área de transferência!')
  }

  const handleWhatsAppCheckout = () => {
    setIsProcessing(true)
    try {
      const { street, number, neighborhood, city, state, cep } = addressData
      const addressString = isAddressCombined || !street 
        ? 'A combinar com o vendedor' 
        : `${street}, ${number} - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`

      let finalMessage = generateWhatsAppMessage(supplier, supplierItems, "A combinar", addressString)
      finalMessage = `*Comprador:* ${buyerName || 'Não informado'}\n\n` + finalMessage

      const phone = supplier.whatsapp || supplier.phone || ''
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`, '_blank')
      
      setOrderSuccess(true)
      clearSupplierItems(supplierId)
    } catch (err) {
      alert('Erro ao redirecionar para o WhatsApp.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-lg w-full text-center border-none shadow-xl rounded-2xl overflow-hidden p-8">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-4">Pedido Realizado!</h1>
            <p className="text-muted-foreground mb-8">
              Seu pedido com o fornecedor <strong>{supplier?.name}</strong> foi registrado com sucesso. 
              {supplier?.social_links?.payment_config?.type === 'manual' 
                ? ' Você precisa enviar o comprovante de pagamento via WhatsApp.' 
                : ' O pagamento está sendo processado e o fornecedor será notificado.'}
            </p>
            
            {supplier?.social_links?.payment_config?.type === 'manual' && (
              <Button 
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/20 mb-4"
                onClick={() => {
                  const phone = supplier.whatsapp || supplier.phone || ''
                  window.open(`https://wa.me/${phone}?text=Olá! Fiz um pedido online e aqui está meu comprovante do PIX.`, '_blank')
                }}
              >
                Enviar Comprovante no WhatsApp
              </Button>
            )}

            <Button 
              variant="outline" 
              className="w-full h-14 text-lg rounded-xl"
              onClick={() => router.push('/')}
            >
              Voltar para o Início
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => checkoutStep === 2 ? setCheckoutStep(1) : router.back()}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Lado Esquerdo - Formulários */}
          <div className="flex-1 space-y-6">
            
            {/* Indicador de Passo */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${checkoutStep === 1 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${checkoutStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
                Entrega
              </div>
              <div className="w-12 h-[2px] bg-border"></div>
              <div className={`flex items-center gap-2 ${checkoutStep === 2 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${checkoutStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
                Pagamento
              </div>
            </div>

            {checkoutStep === 1 ? (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <div className="p-6 bg-slate-50 border-b flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Endereço de Entrega</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="buyerName" className="font-bold flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Seu Nome Completo
                      </Label>
                      <Input 
                        id="buyerName" 
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="h-12 bg-slate-50"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="combinar" 
                        checked={isAddressCombined}
                        onCheckedChange={(c) => setIsAddressCombined(!!c)}
                      />
                      <Label htmlFor="combinar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Vou combinar a entrega e o frete direto com o vendedor no WhatsApp
                      </Label>
                    </div>

                    {!isAddressCombined && (
                      <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        value={addressData.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="street">Rua/Avenida</Label>
                      <Input 
                        id="street" 
                        value={addressData.street}
                        onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input 
                        id="number" 
                        value={addressData.number}
                        onChange={(e) => setAddressData(prev => ({ ...prev, number: e.target.value }))}
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input 
                        id="complement" 
                        value={addressData.complement}
                        onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input 
                        id="neighborhood" 
                        value={addressData.neighborhood}
                        onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade/UF</Label>
                      <Input 
                        id="city" 
                        value={`${addressData.city}${addressData.state ? ' / ' + addressData.state : ''}`}
                        readOnly
                        className="h-12 bg-slate-100 cursor-not-allowed"
                      />
                    </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full h-14 mt-8 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
                    onClick={() => {
                      if (!buyerName.trim()) {
                        alert('Por favor, informe seu nome.')
                        return
                      }
                      setCheckoutStep(2)
                    }}
                  >
                    Ir para Pagamento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Pagamento Seguro</h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
                    <Lock className="w-3 h-3" />
                    100% Seguro
                  </div>
                </div>
                <CardContent className="p-6">
                  {supplier?.social_links?.payment_config?.type === 'manual' && (
                    <div className="space-y-6 mb-8">
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <QrCode className="w-6 h-6 text-blue-600" />
                          <h3 className="font-bold text-lg text-blue-900">Transferência via PIX</h3>
                        </div>
                        <p className="text-sm text-blue-800 mb-6">Realize a transferência para os dados abaixo e clique em confirmar. Seu pedido será enviado para o fornecedor.</p>
                        
                        <div className="space-y-4 bg-white p-4 rounded-xl border">
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase font-bold">Chave PIX</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input readOnly value={supplier.social_links?.payment_config?.manual?.chave_pix || ''} className="font-mono bg-slate-50" />
                              <Button variant="outline" size="icon" onClick={() => copyToClipboard(supplier.social_links?.payment_config?.manual?.chave_pix)}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase font-bold">Banco</Label>
                            <p className="font-medium">{supplier.social_links?.payment_config?.manual?.banco}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase font-bold">Beneficiário</Label>
                            <p className="font-medium">{supplier.social_links?.payment_config?.manual?.beneficiario}</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-green-600 hover:bg-green-700 text-white border-none shadow-green-500/20"
                        onClick={handleManualPaymentSubmit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processando...' : 'Já fiz o Pagamento'}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">Ou</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {supplier?.social_links?.payment_config?.type === 'mercado_pago' && (
                    <div className="space-y-6 mb-8">
                      <div className="bg-slate-50 p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-4">
                        <Image src="/mercado-pago-logo.png" alt="Mercado Pago" width={120} height={40} className="opacity-50" />
                        <h3 className="font-bold text-lg text-foreground">Ambiente Seguro do Mercado Pago</h3>
                        <p className="text-sm text-muted-foreground">Aqui o cliente veria o formulário transparente do Mercado Pago (Boleto, PIX, Cartão) utilizando a chave de produção informada pelo lojista.</p>
                      </div>

                      <Button 
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-[#009EE3] hover:bg-[#0089C5] text-white border-none shadow-blue-500/20"
                        onClick={handleMercadoPagoSubmit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processando...' : 'Pagar Agora com Mercado Pago'}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">Ou</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!supplier?.social_links?.hide_whatsapp && (
                    <div className="space-y-4">
                      <Button 
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-green-600 hover:bg-green-700 text-white border-none shadow-green-500/20 gap-2"
                        onClick={handleWhatsAppCheckout}
                        disabled={isProcessing}
                      >
                        <MessageCircle className="w-5 h-5 fill-white" />
                        {isProcessing ? 'Processando...' : 'Finalizar via WhatsApp'}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Ao finalizar, enviaremos os detalhes do pedido e seus dados diretamente para o vendedor.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>

          {/* Lado Direito - Resumo do Pedido */}
          <div className="lg:w-[400px]">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white sticky top-24">
              <div className="p-6 bg-slate-50 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-muted-foreground" />
                  Resumo da Loja
                </h3>
                <p className="text-muted-foreground font-medium mt-1">{supplier?.name}</p>
              </div>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-y-auto p-6 divide-y">
                  {supplierItems.map((item) => (
                    <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                        <Image 
                          src={item.product.image_url || item.product.image || '/placeholder-product.jpg'} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Qtd: {item.quantity}</p>
                        <p className="font-bold text-primary mt-1">
                          {formatCurrency((item.product.wholesale_price || item.product.wholesalePrice || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-slate-50 border-t space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal de itens</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span>A combinar</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-3xl font-black text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
