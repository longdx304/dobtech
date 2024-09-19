import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Table } from '@/components/Table';
import { Text, Title } from '@/components/Typography';
import { Col, Row } from 'antd';
import { useAdminVariants } from 'medusa-react';
import { FC, useMemo } from 'react';
import { ItemPrice, ItemQuantity } from '..';
import productTotalColumns from './product-total-columns';

type Props = {
	selectedProducts: string[];
	itemQuantities: ItemQuantity[];
	itemPrices: ItemPrice[];
	setCurrentStep: (step: number) => void;
};

/**
 * Component to show total price of selected products
 * @param selectedProducts list of selected product ids
 * @param itemQuantities list of item quantities
 * @param itemPrices list of item prices
 * @param setCurrentStep function to set current step
 * @returns JSX element
 */
const ProductTotalForm: FC<Props> = ({
	selectedProducts,
	itemQuantities,
	itemPrices,
	setCurrentStep,
}) => {
	const { variants } = useAdminVariants({
		id: selectedProducts,
		limit: 100,
	});
	const filterVariants = selectedProducts?.map((id) => {
		return variants?.find((variant) => variant.id === id);
	});

	const columns = useMemo(
		() =>
			productTotalColumns({
				itemQuantities,
				itemPrices,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[itemQuantities, itemPrices, filterVariants]
	);

	const totalPrice = useMemo(() => {
		return filterVariants.reduce((total, variant) => {
			const quantity =
				itemQuantities.find((item) => item.variantId === variant?.id)
					?.quantity || 0;
			const price =
				itemPrices.find((item) => item.variantId === variant?.id)?.unit_price ||
				0;
			return total + quantity * price;
		}, 0);
	}, [filterVariants, itemQuantities, itemPrices]);

	const handleBack = () => {
		setCurrentStep(0);
	};

	const handleContinue = () => {
		setCurrentStep(2);
	};

	return (
		<Row gutter={[16, 16]} className="pt-4">
			<Col span={24}>
				<Flex
					align="center"
					justify="space-between"
					className="p-4 border-0 border-b border-solid border-gray-200"
				>
					<Title level={4} className="">
						Tổng tiền
					</Title>
				</Flex>
			</Col>
			<Col span={24} id="table-product">
				<Flex className="flex-col" gap={12}>
					<Table
						columns={columns as any}
						dataSource={filterVariants ?? []}
						rowKey="id"
						scroll={{ x: 700 }}
						pagination={false}
					/>
					<Text strong className="mt-4">
						Tổng tiền: {totalPrice.toLocaleString()} VND
					</Text>
				</Flex>
			</Col>
			<Col span={24}>
				<Flex justify="flex-end" gap="small" className="mt-4">
					<Button type="default" onClick={handleBack}>
						Quay lại
					</Button>
					<Button onClick={handleContinue} data-testid="next-step">
						Tiếp tục
					</Button>
				</Flex>
			</Col>
		</Row>
	);
};

export default ProductTotalForm;
