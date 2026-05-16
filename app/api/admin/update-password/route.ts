import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { userId, newPassword } = await request.json()

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'UserID and newPassword are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (error) throw error

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error: any) {
    console.error('Error updating password:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
