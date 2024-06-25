import { cn } from '@/lib/utils';
import { getPercentageDiff } from '@/lib/utils/get-precentage-diff';
import { formatAmount } from '@/lib/utils/prices';
import { LineItem, Region } from "@medusajs/medusa"

import { CalculatedVariant } from "types/medusa"

type LineItemPriceProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
  style?: "default" | "tight"
}

const LineItemPrice = ({
  item,
  region,
  style = "default",
}: LineItemPriceProps) => {
  const originalPrice = (item.variant as CalculatedVariant).original_price * item.quantity;
  const hasReducedPrice = (item.total || 0) < originalPrice;

  return (
    <div className="flex flex-col gap-x-2 text-md items-end">
      <div className="text-left">
        <span
          className={cn("text-md font-bold", {
            "text-[#FA6338]": hasReducedPrice,
            "text-black": !hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {formatAmount({
            amount: item.total || 0,
            region: region,
            includeTaxes: false,
          })}
        </span>
      </div>
    </div>
  );
}

export default LineItemPrice;
