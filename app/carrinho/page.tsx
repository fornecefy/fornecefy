"use client"

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  AlertTriangle,
  MessageCircle,
  ShoppingCart,
  CheckCircle,
  Truck,
  MapPin,
  MapPinned
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Header } from '@/components/header'
import { CartProvider, useCart } from '@/lib/cart-context'
import { suppliers, formatCurrency } from '@/lib/data'

function CartContent() {
  const {
    items,
    removeItem,
    updateQuantity,
    getItemsBySupplier,
    getSupplierTotal,
    isMinOrderMet,
    getTotalItems,
    getTotalValue,
    generateWhatsAppMessage,
  } = useCart()

  const [shippingMethods, setShippingMethods] = useState<Record<string, string>>({})
  const [address, setAddress] = useState('')
  const [cep, setCep] = useState('')

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCep(value)
    if (value.length === 8) {
      // Mock address fetch or real Viacep
      setAddress(`Carregando endereço...`)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setAddress(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`)
        } else {
          setAddress('CEP não encontrado')
        }
      } catch (err) {
        setAddress('Erro ao buscar CEP')
      }
    }
  }

  const groupedItems = getItemsBySupplier()
  const totalItems = getTotalItems()
  const totalValue = getTotalValue()

  // Check if all suppliers meet minimum order
  const allMinOrdersMet = Array.from(groupedItems.keys()).every((supplierId) =>
    isMinOrderMet(supplierId)
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Carrinho vazio
            </h1>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao seu carrinho de orçamento para solicitar
              cotações dos fornecedores.
            </p>
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continuar Comprando
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-6">
          Carrinho de Orçamento
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items by Supplier */}
          <div className="lg:col-span-2 space-y-6">
            {Array.from(groupedItems.entries()).map(([supplierId, supplierItems]) => {
              const supplier = suppliers.find((s) => s.id === supplierId)
              if (!supplier) return null

              const supplierTotal = getSupplierTotal(supplierId)
              const minOrderMet = isMinOrderMet(supplierId)
              const remaining = supplier.minOrderValue - supplierTotal

              return (
                <Card key={supplierId} className="bg-card border-border overflow-hidden">
                  <CardHeader className="bg-muted/50 border-b border-border">
                    <div className="flex items-center justify-between">
                      <Link href={`/fornecedor/${supplierId}`}>
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          {supplier.name}
                        </CardTitle>
                      </Link>
                      <Badge variant={minOrderMet ? "default" : "outline"} className={minOrderMet ? "bg-accent text-accent-foreground" : ""}>
                        {minOrderMet ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Pedido Mínimo Atingido
                          </span>
                        ) : (
                          `Mín: ${formatCurrency(supplier.minOrderValue)}`
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Product Items */}
                    <div className="p-4 border-b border-border bg-muted/20">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Método de Envio:</span>
                        </div>
                        <Select 
                          value={shippingMethods[supplierId] || "A combinar"} 
                          onValueChange={(val) => setShippingMethods(prev => ({ ...prev, [supplierId]: val }))}
                        >
                          <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs">
                            <SelectValue placeholder="Selecione o frete" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A combinar">A combinar</SelectItem>
                            <SelectItem value="Grátis">Frete Grátis</SelectItem>
                            <SelectItem value="Motoboy">Motoboy</SelectItem>
                            <SelectItem value="Ônibus">Transportadora / Ônibus</SelectItem>
                            <SelectItem value="Correios">Correios (PAC/SEDEX)</SelectItem>
                            <SelectItem value="Fixo">Valor Fixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Min Order Warning */}
                    {!minOrderMet && (
                      <Alert className="mx-4 mt-4 border-amber-500/50 bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertDescription className="text-amber-700">
                          Faltam <strong>{formatCurrency(remaining)}</strong> para
                          atingir o pedido mínimo deste fornecedor.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Product Items */}
                    <ul className="divide-y divide-border">
                      {supplierItems.map(({ product, quantity }) => (
                        <li key={product.id} className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[10px] h-4 px-1">{product.category}</Badge>
                                <span className="text-[10px] text-primary font-bold uppercase">{supplierItems.find(i => i.product.id === product.id)?.selectedModality}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatCurrency(product.prices?.[supplierItems.find(i => i.product.id === product.id)?.selectedModality || "Atacado"]?.price || product.wholesalePrice)} / un.
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-semibold text-foreground">
                                {formatCurrency(product.wholesalePrice * quantity)}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(product.id, quantity - 1)
                                  }
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(product.id, quantity + 1)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeItem(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Supplier Subtotal & Actions */}
                    <div className="p-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Subtotal do Fornecedor:</span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(supplierTotal)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!minOrderMet}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BA5C] text-white gap-2"
                        onClick={() => {
                          const msg = generateWhatsAppMessage(supplierId, shippingMethods[supplierId], address)
                          window.open(`https://wa.me/${supplier.whatsapp}?text=${msg}`, '_blank')
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Enviar Pedido no WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Orçamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-xs font-semibold uppercase text-muted-foreground">Endereço de Entrega (CEP)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="cep" 
                        placeholder="00000-000" 
                        value={cep} 
                        onChange={handleCEPChange}
                        maxLength={9}
                        className="h-9 text-sm"
                      />
                    </div>
                    {address && (
                      <p className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {address}
                      </p>
                    )}
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de itens:</span>
                      <span className="text-foreground">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fornecedores:</span>
                      <span className="text-foreground">{groupedItems.size}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalValue)}
                  </span>
                </div>

                {!allMinOrdersMet && (
                  <Alert className="border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700 text-sm">
                      Alguns fornecedores ainda não atingiram o pedido mínimo.
                    </AlertDescription>
                  </Alert>
                )}

                 <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  Envie o pedido para cada fornecedor individualmente clicando no botão do WhatsApp em cada seção acima.
                </p>

                <p className="text-xs text-center text-muted-foreground">
                  Ao clicar, você será redirecionado para o WhatsApp para enviar
                  sua solicitação de orçamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  )
}
