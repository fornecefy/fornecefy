const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching suppliers:', error.message)
  } else {
    console.log('Suppliers table is OK. Sample data:', data)
  }

  const { data: pData, error: pError } = await supabase
    .from('products')
    .select('*')
    .limit(1)

  if (pError) {
    console.error('Error fetching products:', pError.message)
  } else {
    console.log('Products table is OK. Sample data:', pData)
  }
}

checkTables()
