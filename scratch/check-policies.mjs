
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rpinrodtgshnorolatry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'
)

async function checkRLS() {
  console.log('Checking RLS policies for products...')
  const { data, error } = await supabase.rpc('get_policies_v2')
  
  if (error) {
    console.log('RPC failed. Trying query on pg_policies via service role...')
    // Note: service role can usually query pg_catalog.pg_policies
    const { data: policies, error: polError } = await supabase
      .from('pg_policies')
      .select('policyname, tablename, cmd, qual, with_check')
      .eq('tablename', 'products')
    
    if (polError) {
       // Trying a different approach: raw SQL via a custom function if it exists
       console.log('Direct query on pg_policies failed.')
       
       // Let's try to just perform an update via ANON key with a mock JWT if we can
    } else {
       console.log('Policies:', policies)
    }
  } else {
    console.log('Policies:', data)
  }
  
  // Let's check for triggers
  console.log('\nChecking for triggers on products...')
  // Triggers are hard to see without direct DB access. 
  // I will try to see if any suspicious columns exist that might be managed by triggers.
}

checkRLS()
