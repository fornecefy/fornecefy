import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'public' } }
  )

  const columns = [
    { name: 'bio', type: 'TEXT', default: "''" },
    { name: 'logo_url', type: 'TEXT', default: "''" },
    { name: 'cover_url', type: 'TEXT', default: "''" },
    { name: 'min_order_value', type: 'NUMERIC', default: '0' },
    { name: 'category', type: 'TEXT', default: "'Geral'" },
    { name: 'whatsapp', type: 'TEXT', default: "''" },
  ]

  const results: string[] = []

  for (const col of columns) {
    try {
      // Use supabase-js to call a raw SQL function
      // Since we can't run DDL through PostgREST, we use the pg_catalog approach
      const { data, error } = await supabaseAdmin.rpc('add_column_if_not_exists', {
        p_table: 'profiles',
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
