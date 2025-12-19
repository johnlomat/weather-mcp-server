import React from "react";
import { Card, Badge, Chip } from "@ainativekit/ui";
import { Product } from "../types";
import { formatPrice, stripHtml } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images[0];
  const regularPrice = formatPrice(product.prices.regular_price, product.prices);
  const salePrice = product.on_sale ? formatPrice(product.prices.sale_price, product.prices) : null;

  return (
    <Card elevationLevel={1}>
      <Card.Header>
        <Card.ChipGroup>
          {product.on_sale && <Chip variant="success">Sale</Chip>}
          {product.is_in_stock ? <Chip variant="neutral">In Stock</Chip> : <Chip variant="error">Out of Stock</Chip>}
        </Card.ChipGroup>
      </Card.Header>
      <Card.Body>
        {mainImage && (
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <img src={mainImage.src} alt={mainImage.alt || product.name} style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "8px" }} />
          </div>
        )}
        <Card.Title>{product.name}</Card.Title>
        <div style={{ fontSize: "24px", fontWeight: 600, textAlign: "center", margin: "12px 0" }}>
          {product.on_sale ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#999", fontSize: "16px", marginRight: "8px" }}>{regularPrice}</span>
              <span style={{ color: "#22c55e" }}>{salePrice}</span>
            </>
          ) : (
            regularPrice
          )}
        </div>
        <Card.Description>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
            {stripHtml(product.short_description).slice(0, 100)}
            {stripHtml(product.short_description).length > 100 ? "..." : ""}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {product.average_rating !== "0" && (
              <Badge variant="neutral">
                ⭐ {product.average_rating} ({product.review_count})
              </Badge>
            )}
            {product.categories.slice(0, 2).map((cat) => (
              <Badge key={cat.name} variant="neutral">
                {cat.name}
              </Badge>
            ))}
          </div>
        </Card.Description>
      </Card.Body>
    </Card>
  );
};
