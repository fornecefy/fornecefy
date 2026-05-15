"use client"

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, MapPin, Store } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Supplier, formatCurrency } from '@/lib/data'

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Link href={`/fornecedor/${supplier.slug || supplier.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 bg-card border-border/60 hover:border-primary/30 h-full rounded-2xl">
        <div className="relative h-32 bg-muted overflow-hidden">
          <Image
            src={supplier.coverImage}
            alt={supplier.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <CardContent className="p-5 relative">
          <div className="absolute -top-10 left-5">
            <div className="w-16 h-16 rounded-2xl border-4 border-card overflow-hidden bg-card shadow-xl transition-transform group-hover:scale-105 duration-300">
              <Image
                src={supplier.logo}
                alt={supplier.name}
                width={64}
                height={64}
                className="object-cover h-full w-full"
              />
            </div>
          </div>
          <div className="pt-8">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {supplier.name}
              </h3>
              {supplier.verified && (
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary/70" />
                <span>{supplier.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-primary/70" />
                <span>{supplier.products?.length || 0} produtos</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border/40">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Segmento</span>
                <span className="text-xs font-bold text-foreground">{supplier.category}</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Ped. Mínimo</span>
                <span className="text-xs font-bold text-primary">{formatCurrency(supplier.minOrderValue)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
