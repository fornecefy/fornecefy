import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTk3MDIsImV4cCI6MjA5NDA3NTcwMn0.p7w4cwwN60wxNBt-6wwUvJCFZPs5m5UsL00ozJDAbAY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('--- TESTE DE INSERÇÃO DE PRODUTO ---')
  
  // Usar um ID de fornecedor real se possível, ou tentar inserir
  const productData = {
    name: 'Produto Teste Antigravity',
    category: 'Eletrônicos',
    wholesale_price: 150.00,
    min_quantity: 5,
    image_url: 'https://via.placeholder.com/300',
    status: 'active',
    // Novos campos
    has_stock_control: true,
    stock_quantity: 50,
    weight: '1.2',
    height: '10',
    width: '20',
    depth: '15',
    shipping_type: 'Correios',
    collections: ['Teste', 'Novidades'],
    variations: [{ name: 'Cor', values: ['Preto', 'Branco'] }]
  }

  console.log('Tentando inserir produto...')
  const { data, error } = await supabase.from('products').insert([productData]).select()

  if (error) {
    console.error('ERRO NA INSERÇÃO:', error)
    if (error.code === '42703') {
      console.log('DICA: Uma ou mais colunas não existem no banco de dados. Verifique se rodou o script SQL.')
    }
  } else {
    console.log('SUCESSO! Produto criado:', data)
  }
}

test()
