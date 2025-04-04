import { LineItemTaxLine, MoneyAmount, Order, Region } from '@medusajs/medusa';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { currencies } from './currencies';

export function normalizeAmount(currency: string, amount: number): number {
	const divisor = getDecimalDigits(currency);
	return amount / divisor;
}

export function displayAmount(currency: string, amount: number) {
	const normalizedAmount = normalizeAmount(currency, amount);

	return normalizedAmount.toFixed(
		currencies[currency.toUpperCase()].decimal_digits
	);
}

export const extractUnitPrice = (
	item: PricedVariant,
	region: Region,
	withTax = true
) => {
	let itemPrice = item.original_price;
	let includesTax = item.original_price_includes_tax;
	let taxRate = item.original_tax;
	let itemPriceType = item.calculated_price_type;

	if (itemPrice === undefined) {
		const regionPrice = item.prices.find(
			(p) => p.currency_code === region.currency_code
		);

		if (!regionPrice) {
			return 0;
		}

		itemPrice = regionPrice.amount as number;
		includesTax = region.includes_tax;
		taxRate = includesTax
			? (itemPrice * region.tax_rate) / (1 + region.tax_rate)
			: itemPrice * region.tax_rate;
	}

	if (itemPriceType === 'sale' || itemPriceType === 'override') {
		return item.calculated_price!;
	}

	if (itemPrice) {
		if (includesTax) {
			if (withTax) {
				return itemPrice;
			} else {
				return itemPrice - (taxRate ?? 0);
			}
		} else {
			if (withTax) {
				return itemPrice + (taxRate ?? 0);
			} else {
				return itemPrice;
			}
		}
	}

	return 0;
};

export const displayUnitPrice = (item: PricedVariant, region: Region) => {
	const currCode = region.currency_code.toUpperCase();

	const price = extractUnitPrice(item, region);
	return `${displayAmount(currCode, price)} ${currCode}`;
};

export const extractOptionPrice = (price: number, region: Region) => {
	let amount = price;
	amount = (amount * (1 + region.tax_rate / 100)) / 100;
	return `${amount} ${region.currency_code.toUpperCase()}`;
};

/**
 * Checks the list of currencies and returns the divider/multiplier
 * that should be used to calculate the persited and display amount.
 * @param currency
 * @return {number}
 */
export function getDecimalDigits(currency: string) {
	const divisionDigits = currencies[currency?.toUpperCase()]?.decimal_digits;
	return Math.pow(10, divisionDigits);
}

export function persistedPrice(currency: string, amount: number): number {
	const multiplier = getDecimalDigits(currency);
	return amount * multiplier;
}

export const stringDisplayPrice = ({
	amount,
	currencyCode,
}: {
	amount: number;
	currencyCode: string;
}) => {
	if (typeof amount === 'undefined' || !currencyCode) {
		return `N/A`;
	}

	const display = displayAmount(currencyCode, amount);
	return `${display} ${currencyCode?.toUpperCase()}`;
};

export const getNativeSymbol = (currencyCode: string) => {
	return currencies[currencyCode?.toUpperCase()]?.symbol_native;
};

type FormatMoneyProps = {
	amount: number;
	currency: string;
	digits?: number;
	tax?: number | LineItemTaxLine[];
};

export function formatAmountWithSymbol({
	amount,
	currency,
	digits,
	tax = 0,
}: FormatMoneyProps) {
	let locale = 'en-US';

	// We need this to display 'Kr' instead of 'DKK'
	if (currency?.toLowerCase() === 'dkk') {
		locale = 'da-DK';
	}
	if (currency?.toLowerCase() === 'vnd') {
		locale = 'vi-VN';
	}

	digits = digits ?? currencies[currency?.toUpperCase()]?.decimal_digits;

	const normalizedAmount = normalizeAmount(currency, amount);
	console.log("normalizedAmount:", normalizedAmount)

	const taxRate =
		tax instanceof Array ? tax.reduce((acc, curr) => acc + curr.rate, 0) : tax;
console.log('normalizedAmount * (1 + taxRate / 100)', normalizedAmount * (1 + taxRate / 100))
	return (
		currency &&
		new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			minimumFractionDigits: digits,
		}).format(normalizedAmount * (1 + taxRate / 100))
	);
}

export const extractNormalizedAmount = (
	amounts: Omit<MoneyAmount, 'beforeInsert'>[],
	order: Omit<Order, 'beforeInsert'>
) => {
	let amount = amounts?.find((ma) => ma?.region_id === order?.region_id);

	if (!amount) {
		amount = amounts?.find((ma) => ma?.currency_code === order?.currency_code);
	}

	if (amount) {
		return normalizeAmount(order?.currency_code, amount.amount);
	}

	return 0;
};
