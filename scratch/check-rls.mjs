
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rpinrodtgshnorolatry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'
)

async function checkRLS() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'products' })
  if (error) {
    // If RPC not available, try to query information_schema or just guess
    console.log('RPC get_policies not available. Trying direct query...')
    const { data: policies, error: polError } = await supabase.from('pg_policies').select('*').eq('tablename', 'products')
    // Wait, pg_policies is usually not exposed.
    console.log('Policies query failed (as expected).')
  } else {
    console.log('Policies:', data)
  }
  
  // Let's try to infer from a sample product
  const { data: sample } = await supabase.from('products').select('*').limit(1)
  console.log('Sample product:', sample[0])
}

checkRLS()
