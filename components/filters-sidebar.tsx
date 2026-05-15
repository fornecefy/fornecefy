"use client"

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CATEGORIES, BRAZIL_STATES } from '@/lib/constants'
import { formatCurrency } from '@/lib/data'

export interface Filters {
  states: string[]
  categories: string[]
  modalities: string[]
  priceRange: [number, number]
  minOrder: number | null
  readyToShip: boolean | null
}

interface FiltersSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const allModalities = ["Atacado", "Fabricante", "Dropshipping", "Distribuidor", "Importador"]

function FilterContent({ filters, onFiltersChange }: FiltersSidebarProps) {
  const handleStateChange = (state: string, checked: boolean) => {
    const newStates = checked
      ? [...filters.states, state]
      : filters.states.filter((s) => s !== state)
    onFiltersChange({ ...filters, states: newStates })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleModalityChange = (modality: string, checked: boolean) => {
    const newModalities = checked
      ? [...filters.modalities, modality]
      : filters.modalities.filter((m) => m !== modality)
    onFiltersChange({ ...filters, modalities: newModalities })
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleReadyToShipChange = (value: boolean | null) => {
    onFiltersChange({ ...filters, readyToShip: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      states: [],
      categories: [],
      modalities: [],
      priceRange: [0, 500],
      minOrder: null,
      readyToShip: null,
    })
  }

  const hasActiveFilters =
    filters.states.length > 0 ||
    filters.categories.length > 0 ||
    filters.modalities.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.readyToShip !== null

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar filtros
        </Button>
      )}

      <Accordion type="multiple" defaultValue={["modalities", "states", "categories"]} className="w-full">
        <AccordionItem value="modalities">
          <AccordionTrigger className="text-sm font-semibold">
            Modalidade
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {allModalities.map((mod) => (
                <div key={mod} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mod-${mod}`}
                    checked={filters.modalities.includes(mod)}
                    onCheckedChange={(checked) =>
                      handleModalityChange(mod, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`mod-${mod}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {mod}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="states" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-semibold">Estados</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {BRAZIL_STATES.map((state) => (
                <div key={state.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`state-${state.value}`}
                    checked={filters.states.includes(state.label)}
                    onCheckedChange={(checked) =>
                      handleStateChange(state.label, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`state-${state.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {state.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-semibold">Categorias</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {CATEGORIES.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.name}`}
                    checked={filters.categories.includes(category.name)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.name, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`cat-${category.name}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">
            Faixa de Preço
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(filters.priceRange[0])}</span>
                <span>{formatCurrency(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold">
            Disponibilidade
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ready-to-ship"
                  checked={filters.readyToShip === true}
                  onCheckedChange={(checked) =>
                    handleReadyToShipChange(checked ? true : null)
                  }
                />
                <Label
                  htmlFor="ready-to-ship"
                  className="text-sm font-normal cursor-pointer"
                >
                  Pronta Entrega
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="made-to-order"
                  checked={filters.readyToShip === false}
                  onCheckedChange={(checked) =>
                    handleReadyToShipChange(checked ? false : null)
                  }
                />
                <Label
                  htmlFor="made-to-order"
                  className="text-sm font-normal cursor-pointer"
                >
                  Sob Encomenda
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </h2>
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
