const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data, error } = await supabase.from('profiles').insert([
    {
        id: '190d73ed-566a-43a8-937e-45b07f55147b', // using same id might fail with duplicate, let's use a dummy
        name: 'Test',
        email: 'test@example.com',
        type: 'fornecedor',
        company: 'Test Company',
        phone: '123',
        cnpj: '123',
        state: 'SP'
    }
  ])
  console.log('Insert Error:', error)
}
testInsert()
