
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rpinrodtgshnorolatry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'
)

async function checkColumns() {
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (data && data[0]) {
    console.log('Columns in products table:', Object.keys(data[0]))
  }
}

checkColumns()
