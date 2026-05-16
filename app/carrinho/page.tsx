"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  MessageCircle, 
  Truck, 
  MapPin, 
  Store,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart-context'
import { formatCurrency } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const router = useRouter()
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getItemsBySupplier, 
    getSupplierTotal, 
    generateWhatsAppMessage 
  } = useCart()
  
  const [suppliersData, setSuppliersData] = useState<Record<string, any>>({})
  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchSuppliers() {
      const grouped = getItemsBySupplier()
      const supplierIds = Array.from(grouped.keys())
      
      if (supplierIds.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('suppliers')
          .select('*')
          .in('user_id', supplierIds)
        
        if (data) {
          const suppliersMap: Record<string, any> = {}
          data.forEach(s => {
            suppliersMap[s.user_id] = s
          })
          
          // Also try by 'id' if some use 'id'
          const remainingIds = supplierIds.filter(id => !suppliersMap[id])
          if (remainingIds.length > 0) {
            const { data: data2 } = await supabase
              .from('suppliers')
              .select('*')
              .in('id', remainingIds)
            
            if (data2) {
              data2.forEach(s => {
                suppliersMap[s.id] = s
              })
            }
          }
          
          setSuppliersData(suppliersMap)
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [items])

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

  const formatAddress = () => {
    const { street, number, neighborhood, city, state, cep } = addressData
    if (!street) return ''
    return `${street}, ${number} - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`
  }

  const handleSendWhatsApp = async (supplierId: string) => {
    const supplier = suppliersData[supplierId]
    const supplierItems = groupedItems.get(supplierId) || []
    
    if (!supplier) {
      alert('Dados do fornecedor não encontrados.')
      return
    }

    if (!user) {
      alert('Você precisa estar logado para finalizar o pedido.')
      router.push('/login?redirect=/carrinho')
      return
    }

    setIsSaving(true)
    const fullAddress = formatAddress()

    try {
      // Salva o pedido no banco de dados
      const { error } = await supabase.from('orders').insert([{
        buyer_id: user.id,
        supplier_id: supplier.user_id || supplier.id,
        items: supplierItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.wholesale_price || item.product.wholesalePrice,
          modality: item.selectedModality
        })),
        total_value: getSupplierTotal(supplierId),
        shipping_address: fullAddress,
        status: 'pending'
      }])

      if (error && error.code !== 'PGRST204') {
        console.error('Erro ao salvar pedido no banco:', error)
        // Continuamos mesmo se o banco falhar, para não barrar o WhatsApp do usuário
      }

      const message = generateWhatsAppMessage(supplier, supplierItems, "A combinar", fullAddress)
      const phone = supplier.whatsapp || supplier.phone || ''
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    } catch (err) {
      console.error('Erro geral ao processar pedido:', err)
    } finally {
      setIsSaving(false)
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

  const groupedItems = getItemsBySupplier()
  const supplierIds = Array.from(groupedItems.keys())

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
              <p className="text-muted-foreground">
                Parece que você ainda não adicionou nenhum produto ao seu carrinho de orçamentos.
              </p>
            </div>
            <Button asChild size="lg" className="w-full h-12 rounded-xl">
              <Link href="/">Começar a Comprar</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content - Items by Supplier */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-primary" />
                Carrinho de Orçamentos
              </h1>
              <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </Badge>
            </div>

            {supplierIds.map(supplierId => {
              const supplier = suppliersData[supplierId] || { name: 'Fornecedor' }
              const supplierItems = groupedItems.get(supplierId) || []
              const total = getSupplierTotal(supplierId)
              const minOrder = supplier.min_order_value || 0
              const isMinMet = total >= minOrder

              return (
                <Card key={supplierId} className="border-none shadow-sm overflow-hidden rounded-2xl">
                  <Link href={`/fornecedor/${supplier.slug || supplier.user_id || supplier.id}`} className="block bg-white border-b p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border bg-muted flex-shrink-0">
                          <Image 
                            src={supplier.company_logo_url || supplier.logo || '/placeholder-logo.png'} 
                            alt={supplier.name} 
                            width={48} 
                            height={48} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-bold text-foreground text-lg">{supplier.name}</h2>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {supplier.state || 'Brasil'}
                          </div>
                        </div>
                      </div>
                      {minOrder > 0 && (
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mínimo do Fornecedor</p>
                          <p className={`text-sm font-bold ${isMinMet ? 'text-green-600' : 'text-amber-600'}`}>
                            {formatCurrency(minOrder)}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-0">
                    <div className="divide-y">
                      {supplierItems.map((item) => (
                        <div key={item.product.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 bg-white hover:bg-slate-50/50 transition-colors">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted border flex-shrink-0">
                            <Image 
                              src={item.product.image_url || item.product.image || '/placeholder-product.jpg'} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <Link href={`/produto/${item.product.id}`} className="font-bold text-base hover:text-primary transition-colors line-clamp-1">
                                  {item.product.name}
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                                  onClick={() => removeItem(item.product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                SKU: {item.product.sku || 'N/A'} • {item.selectedModality}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                              <div className="flex items-center border rounded-lg bg-white overflow-hidden shadow-sm h-9">
                                <button 
                                  className="px-3 h-full hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= (item.product.min_quantity || 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                <button 
                                  className="px-3 h-full hover:bg-muted text-muted-foreground transition-colors"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Subtotal</p>
                                <p className="font-bold text-primary">
                                  {formatCurrency((item.product.wholesale_price || item.product.wholesalePrice || 0) * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Supplier Footer Action */}
                    <div className="p-6 bg-slate-50 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-1">
                        {!isMinMet && (
                          <div className="flex items-center gap-2 text-amber-600 mb-2">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">Faltam {formatCurrency(minOrder - total)} para o mínimo</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">Total deste fornecedor</p>
                        <p className="text-2xl font-black text-foreground">{formatCurrency(total)}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button 
                          variant="outline" 
                          className="rounded-xl h-12 gap-2 border-slate-200"
                          onClick={() => router.push(`/fornecedor/${supplier.slug || supplier.user_id}`)}
                        >
                          <Store className="w-4 h-4" />
                          Ver mais itens
                        </Button>
                        <Button 
                          className={`rounded-xl h-12 gap-2 shadow-lg px-8 bg-green-600 hover:bg-green-700 text-white border-none transition-all hover:scale-105 active:scale-95 ${!isMinMet ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-green-500/20'}`}
                          onClick={() => handleSendWhatsApp(supplierId)}
                          disabled={!isMinMet || isSaving}
                        >
                          <MessageCircle className="w-5 h-5 fill-white" />
                          {isSaving ? 'Processando...' : 'Finalizar via WhatsApp'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Sidebar - Address & Total Summary */}
          <div className="lg:w-[400px] space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <div className="p-6 bg-primary text-primary-foreground">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dados de Entrega
                </h3>
                <p className="text-primary-foreground/70 text-xs mt-1">
                  Opcional: Informe seu endereço para cálculo de frete
                </p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="cep" className="text-xs font-bold text-muted-foreground uppercase">CEP</Label>
                    <Input 
                      id="cep" 
                      placeholder="00000-000"
                      value={addressData.cep}
                      onChange={handleCepChange}
                      className="rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-xs font-bold text-muted-foreground uppercase">Logradouro (Rua/Av)</Label>
                    <Input 
                      id="street" 
                      value={addressData.street}
                      onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                      className="rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-xs font-bold text-muted-foreground uppercase">Número</Label>
                    <Input 
                      id="number" 
                      value={addressData.number}
                      onChange={(e) => setAddressData(prev => ({ ...prev, number: e.target.value }))}
                      className="rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="text-xs font-bold text-muted-foreground uppercase">Complemento</Label>
                    <Input 
                      id="complement" 
                      value={addressData.complement}
                      onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                      className="rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" className="text-xs font-bold text-muted-foreground uppercase">Bairro</Label>
                    <Input 
                      id="neighborhood" 
                      value={addressData.neighborhood}
                      onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                      className="rounded-xl bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs font-bold text-muted-foreground uppercase">Cidade/UF</Label>
                    <Input 
                      id="city" 
                      value={`${addressData.city}${addressData.state ? ' / ' + addressData.state : ''}`}
                      readOnly
                      className="rounded-xl bg-slate-100 border-slate-200 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mt-4">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    O orçamento e as condições de frete serão combinados diretamente com cada fornecedor via WhatsApp.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-xl">Resumo do Pedido</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal de itens</span>
                    <span>{formatCurrency(items.reduce((acc, item) => acc + ((item.product.wholesale_price || item.product.wholesalePrice || 0) * item.quantity), 0))}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total de fornecedores</span>
                    <span>{supplierIds.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-lg">Total Geral</p>
                      <p className="text-xs text-muted-foreground">Excluindo frete (a combinar)</p>
                    </div>
                    <p className="text-3xl font-black text-primary">
                      {formatCurrency(items.reduce((acc, item) => acc + ((item.product.wholesale_price || item.product.wholesalePrice || 0) * item.quantity), 0))}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs text-emerald-800 font-medium">Orçamento seguro via WhatsApp oficial</span>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground hover:text-foreground h-10"
                  onClick={() => router.push('/')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuar comprando
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
