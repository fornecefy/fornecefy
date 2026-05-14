"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Product, Supplier } from './data'

interface FavoritesContextType {
  favoriteProducts: string[]
  favoriteSuppliers: string[]
  addFavoriteProduct: (productId: string) => void
  removeFavoriteProduct: (productId: string) => void
  toggleFavoriteProduct: (productId: string) => void
  isFavoriteProduct: (productId: string) => boolean
  addFavoriteSupplier: (supplierId: string) => void
  removeFavoriteSupplier: (supplierId: string) => void
  toggleFavoriteSupplier: (supplierId: string) => void
  isFavoriteSupplier: (supplierId: string) => boolean
  getFavoriteProductsCount: () => number
  getFavoriteSuppliersCount: () => number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([])
  const [favoriteSuppliers, setFavoriteSuppliers] = useState<string[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('fornecefy_favorite_products')
    const savedSuppliers = localStorage.getItem('fornecefy_favorite_suppliers')
    if (savedProducts) setFavoriteProducts(JSON.parse(savedProducts))
    if (savedSuppliers) setFavoriteSuppliers(JSON.parse(savedSuppliers))
  }, [])

  useEffect(() => {
    localStorage.setItem('fornecefy_favorite_products', JSON.stringify(favoriteProducts))
  }, [favoriteProducts])

  useEffect(() => {
    localStorage.setItem('fornecefy_favorite_suppliers', JSON.stringify(favoriteSuppliers))
  }, [favoriteSuppliers])

  const addFavoriteProduct = (productId: string) => {
    setFavoriteProducts(prev => [...prev, productId])
  }

  const removeFavoriteProduct = (productId: string) => {
    setFavoriteProducts(prev => prev.filter(id => id !== productId))
  }

  const toggleFavoriteProduct = (productId: string) => {
    if (favoriteProducts.includes(productId)) {
      removeFavoriteProduct(productId)
    } else {
      addFavoriteProduct(productId)
    }
  }

  const isFavoriteProduct = (productId: string) => {
    return favoriteProducts.includes(productId)
  }

  const addFavoriteSupplier = (supplierId: string) => {
    setFavoriteSuppliers(prev => [...prev, supplierId])
  }

  const removeFavoriteSupplier = (supplierId: string) => {
    setFavoriteSuppliers(prev => prev.filter(id => id !== supplierId))
  }

  const toggleFavoriteSupplier = (supplierId: string) => {
    if (favoriteSuppliers.includes(supplierId)) {
      removeFavoriteSupplier(supplierId)
    } else {
      addFavoriteSupplier(supplierId)
    }
  }

  const isFavoriteSupplier = (supplierId: string) => {
    return favoriteSuppliers.includes(supplierId)
  }

  const getFavoriteProductsCount = () => favoriteProducts.length
  const getFavoriteSuppliersCount = () => favoriteSuppliers.length

  return (
    <FavoritesContext.Provider value={{
      favoriteProducts,
      favoriteSuppliers,
      addFavoriteProduct,
      removeFavoriteProduct,
      toggleFavoriteProduct,
      isFavoriteProduct,
      addFavoriteSupplier,
      removeFavoriteSupplier,
      toggleFavoriteSupplier,
      isFavoriteSupplier,
      getFavoriteProductsCount,
      getFavoriteSuppliersCount,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
