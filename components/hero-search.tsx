"use client"

import { useState } from 'react'
import { Search, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HeroSearchProps {
  onSearch: (query: string) => void
  searchQuery: string
}

const popularSearches = [
  "Vestidos",
  "Eletrônicos",
  "Cosméticos",
  "Decoração",
]

export function HeroSearch({ onSearch, searchQuery }: HeroSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localQuery)
  }

  const handleQuickSearch = (term: string) => {
    setLocalQuery(term)
    onSearch(term)
  }

  return (
    <div className="bg-primary py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Encontre os melhores fornecedores B2B
          </h1>
          <p className="text-primary-foreground/80 mb-6">
            Conectamos você aos melhores fornecedores de atacado do Brasil
          </p>
          
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos, fornecedores ou categorias..."
                  className="w-full h-12 pl-12 pr-4 text-base bg-background border-0 shadow-lg"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
              >
                Buscar
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-primary-foreground/60 text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Populares:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground underline-offset-2 hover:underline transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
