const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  const { count: supplierCount, error: supplierError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'fornecedor')

  const { count: productCount, error: productError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  console.log('Suppliers:', supplierCount)
  console.log('Products:', productCount)
}

checkDatabase()
