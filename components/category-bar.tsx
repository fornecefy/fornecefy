"use client"

import { 
  Shirt, 
  Smartphone, 
  Sparkles, 
  Home, 
  ShoppingBag,
  Footprints,
  Apple,
  Watch
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface CategoryBarProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Moda Feminina": <Shirt className="w-5 h-5" />,
  "Moda Masculina": <Shirt className="w-5 h-5" />,
  "Acessórios": <Watch className="w-5 h-5" />,
  "Calçados": <Footprints className="w-5 h-5" />,
  "Eletrônicos": <Smartphone className="w-5 h-5" />,
  "Casa e Decoração": <Home className="w-5 h-5" />,
  "Cosméticos": <Sparkles className="w-5 h-5" />,
  "Alimentos": <Apple className="w-5 h-5" />,
}

const categories = [
  "Moda Feminina",
  "Moda Masculina",
  "Acessórios",
  "Calçados",
  "Eletrônicos",
  "Casa e Decoração",
  "Cosméticos",
  "Alimentos",
]

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-1 py-3">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectCategory(null)}
              className="flex-shrink-0 gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => onSelectCategory(category)}
                className="flex-shrink-0 gap-2"
              >
                {categoryIcons[category]}
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
