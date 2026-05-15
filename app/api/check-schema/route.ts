import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Try adding each column individually using raw SQL via a function
    // Since we can't run DDL via PostgREST directly, we'll adapt the save
    // to only use columns that exist

    // First, let's check what columns exist
    const { data: sample, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1)

    const existingColumns = sample && sample.length > 0 ? Object.keys(sample[0]) : []

    return NextResponse.json({
      success: true,
      existingColumns,
      message: 'Column check complete'
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
