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
    <Link href={`/fornecedor/${supplier.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border h-full">
        <div className="relative h-24 bg-muted overflow-hidden">
          <Image
            src={supplier.coverImage}
            alt={supplier.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4 relative">
          <div className="absolute -top-8 left-4">
            <div className="w-14 h-14 rounded-full border-4 border-card overflow-hidden bg-card shadow-md">
              <Image
                src={supplier.logo}
                alt={supplier.name}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          </div>
          <div className="pt-6">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {supplier.name}
              </h3>
              {supplier.verified && (
                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" />
              <span>{supplier.state}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {supplier.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Mín. {formatCurrency(supplier.minOrderValue)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Store className="w-3 h-3" />
              <span>{supplier.products.length} produtos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
