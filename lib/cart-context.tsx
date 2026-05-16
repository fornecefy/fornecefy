"use client"
 
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { formatCurrency, Modalidade } from './data'
import { supabase } from './supabase'

interface CartItem {
  product: any
  quantity: number
  selectedModality: Modalidade
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any, quantity?: number, modality?: Modalidade) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemsBySupplier: () => Map<string, CartItem[]>
  getSupplierTotal: (supplierId: string) => number
  getTotalItems: () => number
  getTotalValue: () => number
  generateWhatsAppMessage: (supplier: any, supplierItems: CartItem[], shippingMethod?: string, address?: string) => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('fornecefy_cart_items')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error parsing cart from localStorage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('fornecefy_cart_items', JSON.stringify(items))
  }, [items])

  const addItem = (product: any, quantity?: number, modality: Modalidade = "Atacado") => {
    const minQty = product.minQuantity || 1
    const finalQuantity = quantity || minQty

    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id && item.selectedModality === modality)
      if (existingItem) {
        return prev.map(item =>
          (item.product.id === product.id && item.selectedModality === modality)
            ? { ...item, quantity: item.quantity + finalQuantity }
            : item
        )
      }
      return [...prev, { product, quantity: finalQuantity, selectedModality: modality }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('fornecefy_cart_items')
  }

  const getItemsBySupplier = () => {
    const grouped = new Map<string, CartItem[]>()
    items.forEach(item => {
      const supplierId = item.product.supplierId || item.product.supplier_id
      if (!grouped.has(supplierId)) {
        grouped.set(supplierId, [])
      }
      grouped.get(supplierId)!.push(item)
    })
    return grouped
  }

  const getSupplierTotal = (supplierId: string) => {
    return items
      .filter(item => (item.product.supplierId || item.product.supplier_id) === supplierId)
      .reduce((sum, item) => {
        const price = item.product.wholesalePrice || item.product.wholesale_price || 0
        return sum + price * item.quantity
      }, 0)
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalValue = () => {
    return items.reduce((sum, item) => {
      const price = item.product.wholesalePrice || item.product.wholesale_price || 0
      return sum + price * item.quantity
    }, 0)
  }

  const generateWhatsAppMessage = (supplier: any, supplierItems: CartItem[], shippingMethod = "A combinar", address = "") => {
    let message = "🛒 *NOVO PEDIDO - FORNECEFY*\n"
    message += "----------------------------------\n"
    message += `🏪 *FORNECEDOR:* ${supplier.name.toUpperCase()}\n`
    message += `🚚 *FRETE:* ${shippingMethod}\n`
    if (address) message += `📍 *ENDEREÇO:* ${address}\n`
    message += "----------------------------------\n\n"
    message += `📦 *ITENS DO PEDIDO:*\n`
    
    supplierItems.forEach(item => {
      const price = item.product.wholesalePrice || item.product.wholesale_price || 0
      message += `🔹 ${item.product.name}\n`
      message += `   • Qtd: ${item.quantity}\n`
      message += `   • Modalidade: ${item.selectedModality}\n`
      message += `   • Preço Un: ${formatCurrency(price)}\n`
      message += `   • Subtotal: ${formatCurrency(price * item.quantity)}\n\n`
    })
    
    message += "----------------------------------\n"
    message += `💰 *VALOR TOTAL: ${formatCurrency(getSupplierTotal(supplier.id || supplier.user_id))}*\n`
    message += "----------------------------------\n"
    message += "\n📌 _Pedido gerado automaticamente via Fornecefy_"
    
    return encodeURIComponent(message)
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemsBySupplier,
      getSupplierTotal,
      getTotalItems,
      getTotalValue,
      generateWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
