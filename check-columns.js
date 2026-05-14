const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'products' })
  
  if (error) {
     // If RPC doesn't exist, try a generic query or check error
     console.log('RPC failed, trying information_schema...')
     const { data: cols, error: colError } = await supabase
       .from('products')
       .select('*')
       .limit(0)
     
     if (colError) console.error(colError)
     else console.log('Columns in products:', Object.keys(cols[0] || {}))
  } else {
    console.log('Columns in products:', data)
  }

  // Also check suppliers columns
  const { data: sCols, error: sColError } = await supabase
    .from('suppliers')
    .select('*')
    .limit(1)
  
  if (sColError) console.error(sColError)
  else console.log('Columns in suppliers:', Object.keys(sCols[0] || {}))
}

getColumns()
