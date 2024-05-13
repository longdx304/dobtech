import { FC, useMemo, useRef, useState } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';
// import { Product } from '@medusajs/medusa';
import { MoneyAmount, Product } from '@medusajs/client-types';
import { useAdminUpdateVariant, adminProductKeys } from 'medusa-react';
import _ from 'lodash';

import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import usePrices from '@/modules/products/hooks/usePrices';
import EditPricesActions from './EditPricesAction';
import EditPricesTable from './EditPricesTable';
import { Flex } from '@/components/Flex';
import { useMessage } from '@/components/Message';

type Props = {
	product?: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

const PricesModal = ({ product, state, handleOk, handleCancel }) => {
	const editedPrices = useRef({});
	const [form] = Form.useForm();
	const { mutateAsync, isLoading } = useAdminUpdateVariant(product?.id);
	const [messageApi, contextHolder] = message.useMessage();

	const {
		selectedCurrencies,
		selectedRegions,
		toggleCurrency,
		toggleRegion,
		storeRegions,
	} = usePrices(product);
	const [isCancel, setIsCancel] = useState<boolean>(false);

	const onFinish = async () => {
		const newVariant = editedPrices?.current;

		// Update prices for each variant
		const promise = newVariant?.map((variant) => {
			const pricesPayload: Partial<MoneyAmount>[] = [];
			// Get all prices keys
			const priceKeys = Object.keys(variant.pricesFormat);
			// Check if price key is in variant prices
			priceKeys.forEach((priceKey) => {
				// Find price by currency code
				const findPrice =
					variant?.prices?.find((item) => item.currency_code === priceKey) ||
					{};
				// Check if price is not empty
				if (!_.isEmpty(findPrice)) {
					// Check if price is different from current price
					if (variant.pricesFormat[priceKey] !== findPrice.amount) {
						pricesPayload.push({
							...findPrice,
							amount: variant.pricesFormat[priceKey],
						});
					}
				} else {
					// If price is empty
					pricesPayload.push({
						currency_code: priceKey,
						amount: variant.pricesFormat[priceKey],
					});
				}
			});
			// Update prices
			// @ts-ignore
			if (pricesPayload?.length) {
				return mutateAsync({
					variant_id: variant.id,
					prices: pricesPayload.map((p) =>
						_.pick(p, ['id', 'amount', 'region_id', 'currency_code'])
					),
				});
			}
		});

		Promise.all(promise)
			.then(() => {
				messageApi.success('Cập nhật giá thành công.');
				handleOk();
			})
			.catch((e: any) => {
				console.log('e', e)
				messageApi.success('Có lỗi xảy ra, vui lòng thử lại sau.');
			});
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
			width={800}
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
					product={product}
					currencies={selectedCurrencies.sort()}
					regions={selectedRegions.sort()}
					onPriceUpdate={onPriceUpdate}
					storeRegions={storeRegions}
					setIsCancel={setIsCancel}
					isCancel={isCancel}
				/>
			</Flex>
		</Modal>
	);
};

export default PricesModal;
