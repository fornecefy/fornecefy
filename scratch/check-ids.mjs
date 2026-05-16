
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rpinrodtgshnorolatry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'
)

async function checkIds() {
  const targetId = '8f7ce43a-3942-452b-8d76-b5850db586f6'
  
  // Is it a supplier id?
  const { data: supById } = await supabase.from('suppliers').select('id, name, user_id').eq('id', targetId).single()
  // Is it a user_id?
  const { data: supByUserId } = await supabase.from('suppliers').select('id, name, user_id').eq('user_id', targetId).single()
  
  console.log('Search by id:', supById)
  console.log('Search by user_id:', supByUserId)
}

checkIds()
