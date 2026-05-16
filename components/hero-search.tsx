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
    <div className="relative bg-primary overflow-hidden py-12 md:py-20">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 tracking-tight">
            O Marketplace B2B <span className="text-white italic">Definitivo</span> do Brasil
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-medium">
            Conectamos lojistas aos melhores fabricantes e distribuidores em uma única plataforma segura e profissional.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex flex-col md:flex-row gap-3 p-2 bg-background/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-all group-focus-within:border-white/20">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="O que você está procurando hoje?"
                    className="w-full h-14 pl-12 pr-4 text-lg bg-background border-0 rounded-xl shadow-inner placeholder:text-muted-foreground/60 focus-visible:ring-0"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-14 px-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Buscar Agora
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              <span className="text-primary-foreground/60 text-sm font-semibold flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                Populares:
              </span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="text-sm font-medium text-primary-foreground/80 hover:text-white transition-all hover:translate-y-[-1px]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
