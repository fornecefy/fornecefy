const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getCols() {
  // Use SQL query via RPC or just try to select from a table that might have info
  // Actually, I can't run raw SQL without an RPC like 'exec_sql'
  
  // Let's try to find an existing RPC or use a trick
  console.log('Checking if there are any products to get columns...')
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) console.error('Error:', error)
  else console.log('Products:', data)
}

getCols()
