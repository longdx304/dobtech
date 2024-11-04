import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { message } from 'antd';
import { isEmpty, isEqual } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

type Props = {
	product: PricedProduct;
};
const useActionProduct = ({ product }: Props) => {
	const [options, setOptions] = useState<Record<string, string>>({});
	const [quantity, setQuantity] = useState(1);

	const variants = product?.variants;

	// initialize the option state
	useEffect(() => {
		const optionObj: Record<string, string> = {};
		if (isEmpty(product?.options)) return;
		for (const option of product.options || []) {
			Object.assign(optionObj, { [option.id]: undefined });
		}

		setOptions(optionObj);
	}, [product]);

	// update the options when a variant is selected
	const updateOptions = (update: Record<string, string>) => {
		setOptions({ ...options, ...update });
	};

	const variantRecord = useMemo(() => {
		const map: Record<string, Record<string, string>> = {};
		if (variants?.length) {
			for (const variant of variants) {
				if (!variant.options || !variant.id) continue;

				const temp: Record<string, string> = {};

				for (const option of variant.options) {
					temp[option.option_id] = option.value;
				}

				map[variant.id] = temp;
			}

			return map;
		}
		return {};
	}, [variants]);

	// memoized function to check if the current options are a valid variant
	const variant = useMemo(() => {
		let variantId: string | undefined = undefined;
		if (isEmpty(variantRecord) || isEmpty(variants)) {
			return undefined;
		}
		for (const key of Object.keys(variantRecord)) {
			if (isEqual(variantRecord[key], options)) {
				variantId = key;
			}
		}

		return variants.find((v) => v.id === variantId);
	}, [options, variantRecord, variants]);

	// if product only has one variant, then select it
	useEffect(() => {
		if (variants?.length === 1 && variants[0].id) {
			setOptions(variantRecord[variants[0].id]);
		}
	}, [variants, variantRecord]);

	// check if the selected variant is in stock
	const inStock = useMemo(() => {
		// If we don't manage inventory, we can always add to cart
		if (variant && !variant.manage_inventory) {
			return true;
		}

		// If we allow back orders on the variant, we can add to cart
		if (variant && variant.allow_backorder) {
			return true;
		}

		// If there is inventory available, we can add to cart
		if (variant?.inventory_quantity && variant?.inventory_quantity > 0) {
			return true;
		}

		// Otherwise, we can't add to cart
		return false;
	}, [variant]);

	// get the inventory quantity of a variant
	const inventoryQuantity = useMemo(() => {
		if (variant) {
			return variant?.inventory_quantity;
		}
		const total =
			variants?.reduce(
				(acc, variant) => acc + (variant?.inventory_quantity ?? 0),
				0
			) || 0;
		return total;
	}, [variant, variants]);

	// get the price of the selected variant
	const price = useMemo(() => {
		if (variants?.length && variant) {
			return variant.prices.find((p) => p.currency_code === 'vnd')?.amount;
		}
	}, [variants, variant]);

	// get the allowed quantities of the selected variant
	const allowedQuantities = useMemo(() => {
		if (variant) {
			return (variant as any)?.allowed_quantities;
		}
		return 6;
	}, [variant]);

	// Initialize the quantity when allowedQuantities change
	useEffect(() => {
		if (allowedQuantities) {
			setQuantity(allowedQuantities); // Set initial quantity to allowedQuantities
		}
	}, [allowedQuantities]);

	const handleAddNumber = () => {
		setQuantity(quantity + allowedQuantities);
	};

	const handleSubtractNumber = () => {
		if (quantity > allowedQuantities) {
			setQuantity(quantity - allowedQuantities);
		}
	};

	const handleInputChange = (value: number) => {
		if (value % allowedQuantities === 0) {
			setQuantity(value);
		} else {
			message.warning(`Số lượng phải là bội số của ${allowedQuantities}.`);
			setQuantity(value);
		}
	};

	return {
		options,
		variant,
		inStock,
		price,
		inventoryQuantity,
		updateOptions,
		allowedQuantities,
		quantity,
		handleAddNumber,
		handleSubtractNumber,
		handleInputChange,
	};
};

export default useActionProduct;
