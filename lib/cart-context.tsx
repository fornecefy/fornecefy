"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem, suppliers, formatCurrency, Modalidade } from './data'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, modality?: Modalidade) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemsBySupplier: () => Map<string, CartItem[]>
  getSupplierTotal: (supplierId: string) => number
  isMinOrderMet: (supplierId: string) => boolean
  getTotalItems: () => number
  getTotalValue: () => number
  generateWhatsAppMessage: (supplierId?: string, shippingMethod?: string, address?: string) => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: Product, quantity?: number, modality: Modalidade = "Atacado") => {
    const minQty = product.prices?.[modality]?.minQuantity || product.minQuantity
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
  }

  const getItemsBySupplier = () => {
    const grouped = new Map<string, CartItem[]>()
    items.forEach(item => {
      const supplierId = item.product.supplierId
      if (!grouped.has(supplierId)) {
        grouped.set(supplierId, [])
      }
      grouped.get(supplierId)!.push(item)
    })
    return grouped
  }

  const getSupplierTotal = (supplierId: string) => {
    return items
      .filter(item => item.product.supplierId === supplierId)
      .reduce((sum, item) => {
        const price = item.product.prices?.[item.selectedModality]?.price || item.product.wholesalePrice
        return sum + price * item.quantity
      }, 0)
  }

  const isMinOrderMet = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    if (!supplier) return true
    return getSupplierTotal(supplierId) >= supplier.minOrderValue
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalValue = () => {
    return items.reduce((sum, item) => {
      const price = item.product.prices?.[item.selectedModality]?.price || item.product.wholesalePrice
      return sum + price * item.quantity
    }, 0)
  }

  const generateWhatsAppMessage = (targetSupplierId?: string, shippingMethod = "A combinar", address = "") => {
    const groupedItems = getItemsBySupplier()
    let message = "🛒 *Pedido via Fornecefy*\n\n"
    
    if (targetSupplierId) {
      const supplierItems = groupedItems.get(targetSupplierId) || []
      const supplier = suppliers.find(s => s.id === targetSupplierId)
      if (supplier) {
        message += `🏪 *Fornecedor:* ${supplier.name}\n`
        message += `🚚 *Frete:* ${shippingMethod}\n`
        if (address) message += `📍 *Endereço:* ${address}\n`
        message += `\n📦 *Itens:*\n`
        
        supplierItems.forEach(item => {
          const price = item.product.prices?.[item.selectedModality]?.price || item.product.wholesalePrice
          message += `• ${item.product.name}\n`
          message += `  Qtd: ${item.quantity} | Mod: ${item.selectedModality}\n`
          message += `  Subtotal: ${formatCurrency(price * item.quantity)}\n\n`
        })
        
        message += `💰 *Total do Fornecedor: ${formatCurrency(getSupplierTotal(targetSupplierId))}*`
      }
    } else {
      // General message for all suppliers (rarely used now but kept for compatibility)
      groupedItems.forEach((supplierItems, sId) => {
        const s = suppliers.find(sup => sup.id === sId)
        if (s) {
          message += `📦 *${s.name}*\n`
          supplierItems.forEach(item => {
            const price = item.product.prices?.[item.selectedModality]?.price || item.product.wholesalePrice
            message += `  • ${item.product.name} - ${item.quantity}un (${item.selectedModality})\n`
          })
          message += `  Subtotal: ${formatCurrency(getSupplierTotal(sId))}\n\n`
        }
      })
      message += `💰 *Total Geral: ${formatCurrency(getTotalValue())}*`
    }
    
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
      isMinOrderMet,
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
