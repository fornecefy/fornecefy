import { supabase } from '../supabase'
import { Supplier } from '../data'

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('status', 'approved')

  if (error) {
    console.error('Error fetching suppliers:', error)
    return []
  }

  // Map database fields to our Supplier interface
  return data.map((item: any) => ({
    id: item.id,
    name: item.name || item.company_name,
    logo: item.company_logo_url || '/placeholder-logo.png',
    coverImage: item.cover_image_url || '/placeholder.jpg',
    bio: item.about_us || item.description || '',
    minOrderValue: item.min_order_value || 0,
    state: item.state,
    category: item.category || 'Geral',
    whatsapp: item.whatsapp || '',
    modalities: item.delivery_types || ['Atacado'],
    plan: item.plan || 'Básico',
    verified: item.verified_badge || false,
    rating: item.average_rating || 0,
  }))
}
