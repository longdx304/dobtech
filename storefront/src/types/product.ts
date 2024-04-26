export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  created_at?: Date
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
  isFeatured?: boolean
}

export type ProductVariantInfo = Pick<ProductVariant, "prices">
export type RegionInfo = Pick<Region, "currency_code" | "tax_code" | "tax_rate">