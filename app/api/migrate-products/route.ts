import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'public' } }
  )

  const columns = [
    { name: 'has_stock_control', type: 'BOOLEAN', default: 'false' },
    { name: 'stock_quantity', type: 'INTEGER', default: '0' },
    { name: 'weight', type: 'TEXT', default: "''" },
    { name: 'height', type: 'TEXT', default: "''" },
    { name: 'width', type: 'TEXT', default: "''" },
    { name: 'depth', type: 'TEXT', default: "''" },
    { name: 'shipping_type', type: 'TEXT', default: "'Correios'" },
    { name: 'collections', type: 'JSONB', default: "'[]'" },
    { name: 'variations', type: 'JSONB', default: "'[]'" },
    { name: 'dropshipping_price', type: 'NUMERIC', default: '0' },
  ]

  const results: string[] = []

  for (const col of columns) {
    try {
      const { data, error } = await supabaseAdmin.rpc('add_column_if_not_exists', {
        p_table: 'products',
        p_column: col.name,
        p_type: col.type,
        p_default: col.default
      })
      
      if (error) {
        results.push(`${col.name}: ${error.message}`)
      } else {
        results.push(`${col.name}: OK`)
      }
    } catch (err: any) {
      results.push(`${col.name}: ${err.message}`)
    }
  }

  return NextResponse.json({ results })
}
