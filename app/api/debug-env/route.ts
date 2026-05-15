import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 12)}...` : 'MISSING',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 10)}...` : 'MISSING',
    r2Url: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ? 'PRESENT' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  })
}
