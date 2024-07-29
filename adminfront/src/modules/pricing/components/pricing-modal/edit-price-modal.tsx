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
		const { variants } = product || ([] as any);
		if (!variants?.length) {
			setDataSource([]);
			return;
		}
		setDataSource(variants as any);
		return;
	};

	const onFinish = async () => {
		const newVariant = editedPrices?.current;
		if (product) {
			product.variants = newVariant;
		}
		handleOk();
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
