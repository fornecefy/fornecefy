"use client"

import { useState, useMemo } from 'react'
import { ChevronRight, Store, Package } from 'lucide-react'
import Link from 'next/link'
import { Header } from './header'
import { Footer } from './footer'
import { HeroSearch } from './hero-search'
import { CategoryBar } from './category-bar'
import { ProductCard } from './product-card'
import { SupplierCard } from './supplier-card'
import { products, suppliers as mockSuppliers } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Filters, FiltersSidebar } from './filters-sidebar'
import { useEffect } from 'react'
import { getSuppliers } from '@/lib/services/supplier-service'
import { Supplier } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    states: [],
    categories: [],
    modalities: [],
    priceRange: [0, 500],
    minOrder: null,
    readyToShip: null,
  })

  const [realSuppliers, setRealSuppliers] = useState<Supplier[]>([])
  const [realProducts, setRealProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Fornecedores
      const data = await getSuppliers()
      setRealSuppliers(data)
      
      // Fetch Produtos
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        
      if (prods && prods.length > 0) {
        // Formata os produtos para o formato esperado pelo frontend
        const formattedProds = prods.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          wholesalePrice: p.wholesale_price || p.price || 0,
          image: p.image_url || p.image || '/placeholder-product.jpg',
          minQuantity: p.min_quantity || 1,
          category: p.category || p.categoria || 'Geral',
          supplierId: p.supplier_id,
          supplierName: p.supplier_name || 'Fornecedor',
          readyToShip: p.ready_to_ship || false,
          verified: p.supplier_verified || false,
        }))
        setRealProducts(formattedProds)
      }
    }
    fetchData()
  }, [])

  const allSuppliers = realSuppliers
  const activeProducts = realProducts

  const suppliers = useMemo(() => {
    if (!searchQuery) return allSuppliers
    const query = searchQuery.toLowerCase()
    return allSuppliers.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.email?.toLowerCase().includes(query) || 
      s.bio.toLowerCase().includes(query) || 
      s.category.toLowerCase().includes(query)
    )
  }, [allSuppliers, searchQuery])

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      // Global Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.supplierName.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Sidebar Filters
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      if (filters.modalities.length > 0) {
        const hasMatchingModality = product.modalities.some(m => filters.modalities.includes(m))
        if (!hasMatchingModality) return false
      }

      if (product.wholesalePrice < filters.priceRange[0] || product.wholesalePrice > filters.priceRange[1]) {
        return false
      }

      if (filters.readyToShip !== null && product.readyToShip !== filters.readyToShip) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, filters])

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Global Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          supplier.name.toLowerCase().includes(query) ||
          supplier.category.toLowerCase().includes(query) ||
          supplier.bio.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Sidebar Filters
      if (filters.states.length > 0 && !filters.states.includes(supplier.state)) {
        return false
      }

      if (filters.categories.length > 0 && !filters.categories.includes(supplier.category)) {
        return false
      }

      if (selectedCategory && supplier.category !== selectedCategory) {
        return false
      }

      if (filters.modalities.length > 0) {
        const hasMatchingModality = supplier.modalities.some(m => filters.modalities.includes(m))
        if (!hasMatchingModality) return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, filters])

  const isSearching = searchQuery.length > 0 || selectedCategory !== null

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <HeroSearch onSearch={setSearchQuery} searchQuery={searchQuery} />
      <CategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {isSearching && <FiltersSidebar filters={filters} onFiltersChange={setFilters} />}
        
        <main className="flex-1">
        {isSearching ? (
          <div className="space-y-6">
            {/* Search Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Resultados da busca
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} produtos e {filteredSuppliers.length} fornecedores encontrados
                </p>
              </div>
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* Suppliers in Search */}
            {filteredSuppliers.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Store className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Fornecedores</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredSuppliers.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                  ))}
                </div>
              </section>
            )}

            {/* Products in Search */}
            {filteredProducts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Produtos</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showActions={isSearching} />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && filteredSuppliers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Tente buscar por outros termos ou explorar nossas categorias.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Suppliers Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Fornecedores em Destaque
                  </h2>
                </div>
                <Link href="/?view=suppliers">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {suppliers.slice(0, searchQuery ? 12 : 3).map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            </section>

            {/* Ready to Ship Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Pronta Entrega
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Produtos disponíveis para envio imediato
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeProducts
                  .filter((p) => p.readyToShip)
                  .slice(0, 10)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} showActions={isSearching} />
                  ))}
              </div>
            </section>

            {/* All Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Todos os Produtos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Explore nosso catálogo completo de atacado
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showActions={isSearching} />
                ))}
              </div>
            </section>
          </div>
        )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
