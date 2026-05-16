import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  console.log('--- TESTE DE INSERÇÃO COM SERVICE ROLE (BYPASS RLS) ---')
  
  const productData = {
    name: 'Produto Teste Admin',
    category: 'Geral',
    wholesale_price: 100,
    min_quantity: 1,
    image_url: 'https://via.placeholder.com/300',
    status: 'active',
    supplier_id: '89b23a3e-e4b0-4236-834e-46092f089fe4', // Usando o user_id do fornecedor
    has_stock_control: false,
    stock_quantity: 0,
    collections: [],
    variations: []
  }

  const { data, error } = await supabase.from('products').insert([productData]).select()

  if (error) {
    console.error('ERRO:', error)
  } else {
    console.log('SUCESSO:', data)
  }
}

test()
