import React from 'react'
import { Card } from '@ainativekit/ui'
import { ProductsWidgetProps } from './types'
import { ProductCard } from './ui/ProductCard'

export const ProductsWidget: React.FC<ProductsWidgetProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Card elevationLevel={1}>
        <Card.Body>
          <Card.Title>No Products Found</Card.Title>
          <Card.Description>Try a different search term or category.</Card.Description>
        </Card.Body>
      </Card>
    )
  }

  if (products.length === 1) {
    return <ProductCard product={products[0]} />
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export * from './types'
