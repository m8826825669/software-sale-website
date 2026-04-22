import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://softcraft.in'

const STATIC_ROUTES = [
  { url: '/',          priority: 1.0,  changeFrequency: 'weekly'  as const },
  { url: '/products',  priority: 0.9,  changeFrequency: 'daily'   as const },
  { url: '/contact',   priority: 0.7,  changeFrequency: 'monthly' as const },
  { url: '/validate',  priority: 0.6,  changeFrequency: 'monthly' as const },
  { url: '/auth/login',     priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/auth/register',  priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/privacy',   priority: 0.3,  changeFrequency: 'yearly'  as const },
  { url: '/terms',     priority: 0.3,  changeFrequency: 'yearly'  as const },
  { url: '/refund',    priority: 0.3,  changeFrequency: 'yearly'  as const },
  { url: '/eula',      priority: 0.3,  changeFrequency: 'yearly'  as const },
]

// Fetch products from API at build time for dynamic routes
async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) throw new Error('API unavailable')
    const data = await res.json()
    const products = data.results || data
    return products.map((p: any) => p.slug)
  } catch {
    // Fallback slugs if API is down during build
    return ['school-erp', 'medical-store', 'accounting', 'clinic-manager', 'hrms']
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductSlugs()

  const productRoutes = slugs.map(slug => ({
    url: `${BASE}/products/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const staticRoutes = STATIC_ROUTES.map(r => ({
    url: `${BASE}${r.url}`,
    lastModified: new Date(),
    priority: r.priority,
    changeFrequency: r.changeFrequency,
  }))

  return [...staticRoutes, ...productRoutes]
}
