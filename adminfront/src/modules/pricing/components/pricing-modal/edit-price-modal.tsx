import { message } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { MoneyAmount, Product } from '@medusajs/medusa';
import _ from 'lodash';
import { useAdminUpdateVariant } from 'medusa-react';

import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import usePrices from '@/modules/products/hooks/usePrices';
import EditPricesActions from './EditPricesAction';
import EditPricesTable from './EditPricesTable';

type Props = {
	product?: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	setProductsData: (data: any) => void;
	discountPercent: number | null;
};

const PricesModal = ({
	product,
	state,
	handleOk,
	handleCancel,
	setProductsData,
	discountPercent,
}: Props) => {
	const editedPrices = useRef<any>([]);
	const { mutateAsync, isLoading } = useAdminUpdateVariant(product?.id || '');
	const [messageApi, contextHolder] = message.useMessage();

	const {
		selectedCurrencies,
		selectedRegions,
		toggleCurrency,
		toggleRegion,
		storeRegions,
	} = usePrices(product!);
	const [dataSource, setDataSource] = useState<any>(null);
	const [isCancel, setIsCancel] = useState<boolean>(false);

	useEffect(() => {
		formatProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, isCancel, discountPercent]);

	const formatProduct = () => {
		const { variants } = product || [];
		if (!variants?.length) {
			setDataSource([]);
			return;
		}
		setDataSource(variants as any);
		return;
	};

	const onFinish = async () => {
		console.log('variant', editedPrices?.current);
		const newVariant = editedPrices?.current;
		product.variants = newVariant;
		handleOk();
		// setProductsData((prev) => [...prev, newVariant]);

		// Update prices for each variant
		// const promise = newVariant?.map((variant: any) => {
		// 	const pricesPayload: Partial<MoneyAmount>[] = [];
		// 	// Get all prices keys
		// 	const priceKeys = Object.keys(variant?.pricesFormatEdit);
		// 	// Check if price key is in variant prices
		// 	priceKeys.forEach((priceKey) => {
		// 		// Find price by currency code
		// 		const findPrice =
		// 			variant?.prices?.find(
		// 				(item: any) => item.currency_code === priceKey
		// 			) || {};
		// 		// Check if price is not empty
		// 		if (!_.isEmpty(findPrice)) {
		// 			// Check if price is different from current price
		// 			if (variant.pricesFormatEdit[priceKey] !== findPrice.amount) {
		// 				pricesPayload.push({
		// 					...findPrice,
		// 					amount: variant.pricesFormatEdit[priceKey],
		// 				});
		// 			}
		// 		} else {
		// 			// If price is empty
		// 			pricesPayload.push({
		// 				currency_code: priceKey,
		// 				amount: variant.pricesFormatEdit[priceKey],
		// 			});
		// 		}
		// 	});
		// 	// Update prices
		// 	// @ts-ignore
		// });

	};

	const onPriceUpdate = (prices: Record<string, number | undefined>[]) => {
		editedPrices.current = prices;
	};

	const onCancel = () => {
		editedPrices.current = {};
		setIsCancel(true);
		handleCancel();
	};

	return (
		<Modal
			open={state}
			handleOk={onFinish}
			isLoading={isLoading}
			handleCancel={onCancel}
			width={500}
		>
			{contextHolder}
			<Title level={3} className="text-center">
				{`Chỉnh sửa giá tiền`}
			</Title>
			<Flex vertical gap="middle">
				<EditPricesActions
					selectedCurrencies={selectedCurrencies.sort()}
					selectedRegions={selectedRegions.sort()}
					toggleCurrency={toggleCurrency}
					toggleRegion={toggleRegion}
				/>
				<EditPricesTable
					discountPercent={discountPercent}
					product={product!}
					currencies={selectedCurrencies.sort()}
					regions={selectedRegions.sort()}
					onPriceUpdate={onPriceUpdate}
					storeRegions={storeRegions}
					setIsCancel={setIsCancel}
					isCancel={isCancel}
					dataSource={dataSource}
					setDataSource={setDataSource}
				/>
			</Flex>
		</Modal>
	);
};

export default PricesModal;
