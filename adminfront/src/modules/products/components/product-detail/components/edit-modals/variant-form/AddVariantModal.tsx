import { FC, useEffect, useState } from 'react';
import { Form, message, type FormProps, type CollapseProps } from 'antd';
import { Plus, Minus } from 'lucide-react';
import { useAdminCreateVariant, useAdminUpdateVariant } from 'medusa-react';
import {
	AdminPostProductsProductVariantsReq,
	Product,
	ProductVariant,
	AdminPostProductsProductVariantsVariantReq,
} from '@medusajs/medusa';

import { SubmitModal } from '@/components/Modal';
import { Collapse } from '@/components/Collapse';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import VariantGeneral from './VariantGeneral';
import VariantStock from './VariantStock';
import VariantShipping from './VariantShipping';
import { VariantFormType } from '@/types/products';
import _ from 'lodash';
import { useMedusa } from 'medusa-react';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	product: Product;
	variant?: ProductVariant;
	typeVariant: 'CREATE' | 'UPDATE' | 'COPY' | null;
};

const AddVariantModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	product,
	variant,
	typeVariant,
}) => {
	const createVariant = useAdminCreateVariant(product.id);
	const updateVariant = useAdminUpdateVariant(product.id);
	const { client } = useMedusa();
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const [defaultActiveKey, setDefaultActiveKey] = useState<string[]>([
		'general',
	]);

	const itemsCollapse: CollapseProps['items'] = [
		{
			key: 'general',
			label: (
				<Flex>
					<div>{'Thông tin chung'}</div>
					<div className="text-rose-600 text-xl">{'*'}</div>
				</Flex>
			),
			children: <VariantGeneral form={form} options={product?.options} />,
		},
		{
			key: 'stock_inventory',
			label: 'Hàng tồn kho',
			children: <VariantStock form={form} />,
		},
		{
			key: 'shipping',
			label: 'Vận chuyển',
			children: <VariantShipping form={form} />,
		},
	];

	useEffect(() => {
		setDefaultActiveKey(['general']);
		if (variant) {
			if (typeVariant === 'UPDATE') {
				form.setFieldsValue({
					...variant,
					options: variant.options.map((option) => ({
						option_id: option.option_id,
						value: [option.value],
					})),
				});
			}
			if (typeVariant === 'COPY') {
				form.setFieldsValue({
					...variant,
					options: [],
				});
			}
		}
	}, [variant, typeVariant]);

	const handleOnOk = () => {
		handleOk();
	};
	const onCancel = () => {
		form.resetFields();
		handleCancel();
	};

	// const createStockLocationsForVariant = async (
	//   productRes: Product,
	//   stock_locations: { stocked_quantity: number; location_id: string }[]
	// ) => {
	//   const { variants } = productRes

	//   const pvMap = new Map(product.variants.map((v) => [v.id, true]))
	//   const addedVariant = variants.find((variant) => !pvMap.get(variant.id))

	//   if (!addedVariant) {
	//     return
	//   }

	//   const inventory = await client.admin.variants.getInventory(addedVariant.id)

	//   await Promise.all(
	//     inventory.variant.inventory
	//       .map(async (item) => {
	//         return Promise.all(
	//           stock_locations.map(async (stock_location) => {
	//             client.admin.inventoryItems.createLocationLevel(item.id!, {
	//               location_id: stock_location.location_id,
	//               stocked_quantity: stock_location.stocked_quantity,
	//             })
	//           })
	//         )
	//       })
	//       .flat()
	//   )
	// }

	const onFinish: FormProps<VariantFormType>['onFinish'] = async (values) => {
		try {
			const payload:
				| AdminPostProductsProductVariantsReq
				| AdminPostProductsProductVariantsVariantReq = createAddPayload(values);
			// Update variant

			if (typeVariant === 'UPDATE' && variant) {
				updateVariant.mutate(
					{ ...payload, variant_id: variant.id },
					{
						onSuccess: ({ product }) => {
							messageApi.success('Chỉnh sửa bản thành công');
							handleOk();
							form.resetFields();
							// createStockLocationsForVariant(productRes, stock_location).then(() => {
							// })
						},
						onError: (error) => {
							messageApi.error('Chỉnh sửa phiên bản thất bại');
							handleOk();
							form.resetFields();
						},
					}
				);
				return;
			}
			if (['COPY', 'CREATE'].includes(typeVariant || '')) {
				// Create variant
				createVariant.mutate(payload as AdminPostProductsProductVariantsReq, {
					onSuccess: ({ product }) => {
						messageApi.success('Tạo phiên bản thành công');
						handleOk();
						form.resetFields();
						// createStockLocationsForVariant(productRes, stock_location).then(() => {
						// })
					},
					onError: (error) => {
						messageApi.error('Tạo phiên bản thất bại');
						handleOk();
						form.resetFields();
					},
				});
			}
		} catch (error) {
			messageApi.error(`error: ${error}`);
		}
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOnOk}
			isLoading={createVariant?.isLoading}
			handleCancel={onCancel}
			width={600}
			form={form}
		>
			{contextHolder}
			<Title level={3} className="text-center">
				{!variant ? 'Tạo phiên bản' : 'Chỉnh sửa phiên bản'}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-3">
				<Collapse
					className="bg-white [&_.ant-collapse-header]:px-0 [&_.ant-collapse-header]:py-4 [&_.ant-collapse-header]:text-base [&_.ant-collapse-header]:font-medium"
					defaultActiveKey={defaultActiveKey}
					items={itemsCollapse}
					expandIconPosition="end"
					bordered={false}
					expandIcon={({ isActive }) =>
						isActive ? <Minus size={20} /> : <Plus size={20} />
					}
				/>
			</Form>
		</SubmitModal>
	);
};

export default AddVariantModal;

const createAddPayload = (
	data: VariantFormType
):
	| AdminPostProductsProductVariantsReq
	| AdminPostProductsProductVariantsVariantReq => {
	return {
		...data,
		title:
			data?.title ||
			`${data?.options.map((option) => option.value[0]).join(' / ')}`,
		options: data.options.map((option) => ({
			option_id: option.option_id,
			value: option.value[0],
		}) as any),
		prices: [],
		inventory_quantity: data?.inventory_quantity || 0,
	};
};
