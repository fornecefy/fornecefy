
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rpinrodtgshnorolatry.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'
)

async function check() {
  console.log('Checking database status...')
  
  try {
    const { data: sample, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1)
    
    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return
    }
    
    console.log('Successfully fetched sample product:', sample[0]?.name)
    
    if (sample.length > 0) {
      const id = sample[0].id
      console.log(`Attempting to update product ${id}...`)
      
      const start = Date.now()
      const { error: updateError } = await supabase
        .from('products')
        .update({ name: sample[0].name + ' ' })
        .eq('id', id)
      
      const end = Date.now()
      console.log(`Update took ${end - start}ms`)
      
      if (updateError) {
        console.error('Update error:', updateError)
      } else {
        console.log('Update successful!')
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

check()
