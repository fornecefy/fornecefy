const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabase() {
  console.log('Testing Supabase product insertion...')
  
  try {
    const testProduct = {
      name: 'Produto Teste Fornecefy',
      category: 'Teste',
      description: 'Isso é um produto de teste para validar o cadastro',
      wholesale_price: 10.99,
      retail_price: 15.99,
      min_quantity: 10,
      ready_to_ship: true,
      image_url: 'https://pub-r2.fornecefy.com.br/test-image.jpg',
      sku: 'TEST-001',
      status: 'active'
    }

    console.log('1. Inserting product...')
    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select()

    if (error) {
      console.error('❌ Insert failed:', error.message)
      return
    }

    console.log('✅ Insert successful!', data[0].id)

    console.log('\n2. Cleaning up test product...')
    const { error: delError } = await supabase
      .from('products')
      .delete()
      .eq('id', data[0].id)

    if (delError) {
      console.error('❌ Delete failed:', delError.message)
    } else {
      console.log('✅ Cleanup successful!')
    }

  } catch (err) {
    console.error('❌ Error during Supabase test:', err)
  }
}

testSupabase()
