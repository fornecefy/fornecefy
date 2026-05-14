"use client"

import { CartProvider } from '@/lib/cart-context'
import { Marketplace } from '@/components/marketplace'

export default function HomePage() {
  return (
    <CartProvider>
      <Marketplace />
    </CartProvider>
  )
}
