import { supabase } from '../supabase'
import { Supplier } from '../data'

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    console.log('SupplierService: Buscando fornecedores...')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('type', 'fornecedor')
    
    if (error) {
      console.error('SupplierService: Erro ao buscar fornecedores:', error.message)
      return []
    }

    if (!data) return []

    console.log(`SupplierService: ${data.length} fornecedores encontrados.`)

    // Map database fields to our Supplier interface
    return data.map((item: any) => ({
      id: item.id,
      name: item.company || item.name,
      logo: item.logo_url || '/placeholder-logo.png',
      coverImage: item.cover_url || '/placeholder.jpg',
      bio: item.bio || '',
      minOrderValue: item.min_order_value || 0,
      state: item.state || '',
      category: item.category || 'Geral',
      whatsapp: item.phone || item.whatsapp || '',
      modalities: item.modalities || ['Atacado'],
      plan: item.plan || 'Básico',
      verified: item.verified || false,
      rating: item.rating || 0,
      products: [], // Inicialmente vazio
    }))
  } catch (err) {
    return []
  }
}
