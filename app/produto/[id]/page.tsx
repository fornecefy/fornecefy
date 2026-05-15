import { supabase } from '@/lib/supabase'
import ProductClient from '@/components/product-client'
import { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: productId } = await params
  
  const { data: product } = await supabase
    .from('products')
    .select('*, suppliers(*)')
    .eq('id', productId)
    .single()

  if (!product) {
    return {
      title: 'Produto não encontrado | Fornecefy',
    }
  }

  const supplierName = (product.suppliers as any)?.name || 'Fornecedor'
  const seoTitle = `${product.name} | Atacado de ${product.category || 'Produtos'} | ${supplierName}`
  const seoDescription = product.description || `Compre ${product.name} no atacado direto de ${supplierName}. Melhores condições B2B no Fornecefy.`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [product.name, product.category, supplierName, 'atacado', 'B2B', 'preço fábrica'],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [product.image_url || product.image || '/placeholder-product.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [product.image_url || product.image || '/placeholder-product.jpg'],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  return <ProductClient productId={id} />
}
