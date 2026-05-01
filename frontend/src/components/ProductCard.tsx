'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
import TryDemoButton from '@/components/TryDemoButton'

export interface Product {
  id?:            string
  slug:           string
  name:           string
  emoji?:         string
  tagline?:       string
  description?:   string
  tags?:          string[]
  rating?:        number | string
  rating_count?:  number
  starting_price?: string
  price?:         string
  is_featured?:   boolean
  demo_type?:     'online' | 'trial' | 'request' | 'none'
  demo_url?:      string
  trial_days?:    number
}

interface ProductCardProps {
  product:     Product
  index?:      number          // animation stagger index
  variant?:    'default' | 'compact' | 'hero'
  showDemo?:   boolean
  showRating?: boolean
  animated?:   boolean
}

export default function ProductCard({
  product: p,
  index      = 0,
  variant    = 'default',
  showDemo   = true,
  showRating = true,
  animated   = true,
}: ProductCardProps) {

  const price = p.starting_price
    ? `₹${parseFloat(p.starting_price).toLocaleString('en-IN')}`
    : p.price || ''

  const demoConfig = {
    type:        (p.demo_type as any) || 'request',
    url:         p.demo_url   || '',
    trialDays:   p.trial_days || 15,
    productName: p.name,
    productSlug: p.slug,
    productEmoji: p.emoji,
  }

  const card = (
    <div className={`group card relative overflow-hidden transition-all duration-300
      hover:border-ink-500/30 hover:shadow-card-hover
      ${variant === 'compact' ? 'p-4' : ''}
      ${variant === 'hero'    ? 'border-ink-500/20' : ''}
    `}>

      {/* Featured badge */}
      {p.is_featured && (
        <div className="absolute top-4 right-4 badge-gold text-[10px]">
          Most Popular
        </div>
      )}

      {/* Emoji icon */}
      <div className={`mb-5 ${variant === 'compact' ? 'text-4xl' : 'text-5xl'}`}>
        {p.emoji || '📦'}
      </div>

      {/* Name */}
      <h3 className={`font-display font-bold text-white group-hover:text-ink-300
        transition-colors leading-tight mb-2
        ${variant === 'compact' ? 'text-lg' : 'text-xl'}
      `}>
        {p.name}
      </h3>

      {/* Tagline */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
        {p.tagline || p.description}
      </p>

      {/* Tags */}
      {p.tags && p.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.tags.slice(0, variant === 'compact' ? 3 : undefined).map(tag => (
            <span key={tag} className="badge-blue text-[10px]">{tag}</span>
          ))}
        </div>
      )}

      {/* Rating */}
      {showRating && p.rating && parseFloat(String(p.rating)) > 0 && (
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
          <span className="text-xs text-gray-400">
            {parseFloat(String(p.rating)).toFixed(1)}
            {p.rating_count ? ` (${p.rating_count} reviews)` : ''}
          </span>
        </div>
      )}

      {/* Footer: price + actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-auto">
        <div>
          {price && (
            <>
              <div className="font-display font-bold text-white text-xl">
                {price}
                <span className="text-xs font-normal text-gray-600 ml-1">+GST</span>
              </div>
              <div className="text-[10px] text-gray-600">one-time · lifetime</div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showDemo && p.demo_type !== 'none' && (
            <TryDemoButton demo={demoConfig} variant="card" />
          )}
          <Link
            href={`/products/${p.slug}`}
            className="btn-primary text-sm py-2 px-4 gap-1.5"
          >
            Buy Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )

  if (!animated) return card

  return (
    <motion.div
      key={p.id || p.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
    >
      {card}
    </motion.div>
  )
}