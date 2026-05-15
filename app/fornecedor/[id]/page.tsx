import { use } from 'react'
import { supabase } from '@/lib/supabase'
import SupplierClient from '@/components/supplier-client'
import { Metadata } from 'next'

interface SupplierPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: supplierId } = await params
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(supplierId);

  let query = supabase.from('suppliers').select('*');
  if (isUUID) {
    query = query.eq('id', supplierId);
  } else {
    query = query.eq('slug', supplierId);
  }

  const { data: supplier } = await query.single();
  
  if (!supplier) {
    return {
      title: 'Fornecedor não encontrado | Fornecefy',
    }
  }

  const seoTitle = `${supplier.name} | Vitrine Oficial Atacado | Fornecefy`
  const seoDescription = supplier.description || `Confira os produtos e ofertas de ${supplier.name} no Fornecefy. O melhor do atacado nacional em um só lugar.`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [supplier.name, supplier.category, 'atacado', 'fornecedor', 'B2B', 'Brasil'],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [supplier.logo || '/placeholder-logo.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [supplier.logo || '/placeholder-logo.png'],
    }
  }
}

export default async function SupplierStorefront({ params }: SupplierPageProps) {
  const { id } = await params
  return <SupplierClient supplierId={id} />
}
