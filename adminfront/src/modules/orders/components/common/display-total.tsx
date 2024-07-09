import { clsx } from "clsx"
import { formatAmountWithSymbol } from "@/utils/prices"

export const DisplayTotal = ({
  totalAmount,
  totalTitle,
  currency,
  variant = "regular",
  subtitle = "",
  totalColor = "text-gray-900",
}: {
  totalAmount: any
  totalTitle: any
  currency: any
  variant?: any
  subtitle?: any
  totalColor?: any
}) => (
  <div className="mt-4 flex items-center justify-between text-[12px]">
    <div className="flex flex-col">
      <div
        className={clsx("text-gray-900", {
          "font-normal": variant === "regular",
          "font-medium": variant === "large" || variant === "bold",
        })}
      >
        {totalTitle}
      </div>
      {subtitle && (
        <div className="font-normal text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
    <DisplayTotalAmount
      totalAmount={totalAmount}
      currency={currency}
      variant={variant}
      totalColor={totalColor}
    />
  </div>
)

export const DisplayTotalAmount = ({
  totalColor = "text-gray-900",
  variant = "regular",
  totalAmount,
  currency,
}: {
  totalColor?: string
  variant?: "regular" | "large" | "bold"
  totalAmount: number
  currency: string
}) => (
  <div className="flex">
    <div
      className={clsx(totalColor, {
        "font-normal mr-3": variant === "regular",
        "font-medium": variant === "bold",
        "font-bold": variant === "large",
      })}
    >
      {formatAmountWithSymbol({
        amount: totalAmount,
        currency,
      })}
    </div>
    {variant === "regular" && (
      <div className="font-normal text-gray-500">
        {currency.toUpperCase()}
      </div>
    )}
  </div>
)
