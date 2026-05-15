export type Modalidade = "Atacado" | "Fabricante" | "Dropshipping" | "Distribuidor" | "Importador"
export type Plan = "Básico" | "Pro" | "Premium" | "Elite"

export interface Product {
  id: string
  name: string
  image: string
  wholesalePrice: number
  minQuantity: number
  supplierId: string
  supplierName: string
  supplierVerified: boolean
  category: string
  readyToShip: boolean
  modalities: Modalidade[]
  prices?: Record<string, { price: number; minQuantity: number }>
  sku?: string
  youtubeUrl?: string
  description?: string
  gallery?: string[]
}

export interface Supplier {
  id: string
  name: string
  logo: string
  coverImage: string
  bio: string
  minOrderValue: number
  state: string
  category: string
  verified: boolean
  whatsapp: string
  products: Product[]
  modalities: Modalidade[]
  plan: Plan
  socialLinks?: {
    instagram?: string
    facebook?: string
    website?: string
  }
  videoUrl?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedModality: Modalidade
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  date: string
  message: string
}


export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Fashion Brasil",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=300&fit=crop",
    bio: "Somos uma empresa especializada em moda feminina de alta qualidade. Trabalhamos com as melhores tendências do mercado há mais de 15 anos, oferecendo produtos exclusivos para lojistas de todo o Brasil.",
    minOrderValue: 500,
    state: "São Paulo",
    category: "Moda Feminina",
    verified: true,
    whatsapp: "5511999999999",
    products: [],
    modalities: ["Atacado", "Fabricante"],
    plan: "Pro",
    socialLinks: {
      instagram: "https://instagram.com/fashionbrasil",
      facebook: "https://facebook.com/fashionbrasil"
    }
  },
  {
    id: "2",
    name: "Tech Solutions",
    logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop",
    bio: "Distribuidora de eletrônicos e acessórios de tecnologia. Produtos originais com garantia de fábrica e os melhores preços do mercado atacadista.",
    minOrderValue: 1000,
    state: "São Paulo",
    category: "Eletrônicos",
    verified: true,
    whatsapp: "5511988888888",
    products: [],
    modalities: ["Atacado", "Importador", "Distribuidor"],
    plan: "Premium",
    socialLinks: {
      website: "https://techsolutions.com.br"
    }
  },
  {
    id: "3",
    name: "Casa & Estilo",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=300&fit=crop",
    bio: "Especialistas em artigos para casa e decoração. Oferecemos uma linha completa de produtos para transformar ambientes com elegância e sofisticação.",
    minOrderValue: 300,
    state: "Minas Gerais",
    category: "Casa e Decoração",
    verified: false,
    whatsapp: "5531977777777",
    products: [],
    modalities: ["Atacado"],
    plan: "Básico"
  },
  {
    id: "4",
    name: "Beleza Total",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=300&fit=crop",
    bio: "Distribuidora de cosméticos e produtos de beleza das melhores marcas nacionais e importadas. Preços especiais para revendedores e lojistas.",
    minOrderValue: 250,
    state: "Rio de Janeiro",
    category: "Cosméticos",
    verified: true,
    whatsapp: "5521966666666",
    products: [],
    modalities: ["Atacado", "Dropshipping"],
    plan: "Pro"
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Vestido Midi Floral Premium",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    wholesalePrice: 89.90,
    minQuantity: 6,
    supplierId: "1",
    supplierName: "Fashion Brasil",
    supplierVerified: true,
    category: "Moda Feminina",
    readyToShip: true,
    modalities: ["Atacado", "Fabricante"],
    prices: {
      "Atacado": { price: 89.90, minQuantity: 6 },
      "Fabricante": { price: 75.00, minQuantity: 50 }
    }
  },
  {
    id: "2",
    name: "Blusa Social Crepe",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=400&fit=crop",
    wholesalePrice: 45.50,
    minQuantity: 12,
    supplierId: "1",
    supplierName: "Fashion Brasil",
    supplierVerified: true,
    category: "Moda Feminina",
    readyToShip: true,
    modalities: ["Atacado"],
    prices: {
      "Atacado": { price: 45.50, minQuantity: 12 }
    }
  },
  {
    id: "3",
    name: "Calça Pantalona Alfaiataria",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    wholesalePrice: 75.00,
    minQuantity: 6,
    supplierId: "1",
    supplierName: "Fashion Brasil",
    supplierVerified: true,
    category: "Moda Feminina",
    readyToShip: false,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 75.00, minQuantity: 6 } }
  },
  {
    id: "4",
    name: "Fone Bluetooth TWS Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    wholesalePrice: 35.00,
    minQuantity: 20,
    supplierId: "2",
    supplierName: "Tech Solutions",
    supplierVerified: true,
    category: "Eletrônicos",
    readyToShip: true,
    modalities: ["Atacado", "Importador"],
    prices: {
      "Atacado": { price: 35.00, minQuantity: 20 },
      "Importador": { price: 28.00, minQuantity: 100 }
    }
  },
  {
    id: "5",
    name: "Carregador Portátil 10000mAh",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    wholesalePrice: 42.00,
    minQuantity: 15,
    supplierId: "2",
    supplierName: "Tech Solutions",
    supplierVerified: true,
    category: "Eletrônicos",
    readyToShip: true,
    modalities: ["Atacado", "Distribuidor"],
    prices: {
      "Atacado": { price: 42.00, minQuantity: 15 },
      "Distribuidor": { price: 35.00, minQuantity: 50 }
    }
  },
  {
    id: "6",
    name: "Cabo USB-C Reforçado 2m",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
    wholesalePrice: 8.50,
    minQuantity: 50,
    supplierId: "2",
    supplierName: "Tech Solutions",
    supplierVerified: true,
    category: "Eletrônicos",
    readyToShip: true,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 8.50, minQuantity: 50 } }
  },
  {
    id: "7",
    name: "Almofada Decorativa Veludo",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop",
    wholesalePrice: 22.00,
    minQuantity: 10,
    supplierId: "3",
    supplierName: "Casa & Estilo",
    supplierVerified: false,
    category: "Casa e Decoração",
    readyToShip: true,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 22.00, minQuantity: 10 } }
  },
  {
    id: "8",
    name: "Vaso Cerâmica Artesanal",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    wholesalePrice: 45.00,
    minQuantity: 8,
    supplierId: "3",
    supplierName: "Casa & Estilo",
    supplierVerified: false,
    category: "Casa e Decoração",
    readyToShip: false,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 45.00, minQuantity: 8 } }
  },
  {
    id: "9",
    name: "Kit Skincare Facial 5 Produtos",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    wholesalePrice: 68.00,
    minQuantity: 6,
    supplierId: "4",
    supplierName: "Beleza Total",
    supplierVerified: true,
    category: "Cosméticos",
    readyToShip: true,
    modalities: ["Atacado", "Dropshipping"],
    prices: {
      "Atacado": { price: 68.00, minQuantity: 6 },
      "Dropshipping": { price: 85.00, minQuantity: 1 }
    }
  },
  {
    id: "10",
    name: "Batom Matte Longa Duração",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    wholesalePrice: 12.50,
    minQuantity: 24,
    supplierId: "4",
    supplierName: "Beleza Total",
    supplierVerified: true,
    category: "Cosméticos",
    readyToShip: true,
    modalities: ["Atacado", "Dropshipping"],
    prices: {
      "Atacado": { price: 12.50, minQuantity: 24 },
      "Dropshipping": { price: 18.00, minQuantity: 1 }
    }
  },
  {
    id: "11",
    name: "Paleta de Sombras 18 Cores",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
    wholesalePrice: 28.00,
    minQuantity: 12,
    supplierId: "4",
    supplierName: "Beleza Total",
    supplierVerified: true,
    category: "Cosméticos",
    readyToShip: true,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 28.00, minQuantity: 12 } }
  },
  {
    id: "12",
    name: "Conjunto Fitness Feminino",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=400&fit=crop",
    wholesalePrice: 55.00,
    minQuantity: 10,
    supplierId: "1",
    supplierName: "Fashion Brasil",
    supplierVerified: true,
    category: "Moda Feminina",
    readyToShip: true,
    modalities: ["Atacado"],
    prices: { "Atacado": { price: 55.00, minQuantity: 10 } }
  },
]

// Associate products with suppliers
suppliers.forEach(supplier => {
  supplier.products = products.filter(p => p.supplierId === supplier.id)
})

export const leads: Lead[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@lojadamaria.com",
    phone: "(11) 99999-1234",
    date: "2024-01-15",
    message: "Interesse em vestidos midi para revenda",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@santosstore.com",
    phone: "(21) 98888-5678",
    date: "2024-01-14",
    message: "Gostaria de saber sobre pedido mínimo",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@modaana.com",
    phone: "(31) 97777-9012",
    date: "2024-01-13",
    message: "Procurando fornecedor de blusas sociais",
  },
  {
    id: "4",
    name: "Pedro Lima",
    email: "pedro@limamoda.com",
    phone: "(41) 96666-3456",
    date: "2024-01-12",
    message: "Interesse em parceria de longo prazo",
  },
]

export const dashboardMetrics = {
  whatsappClicks: 147,
  storefrontViews: 1234,
  totalLeads: leads.length,
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
