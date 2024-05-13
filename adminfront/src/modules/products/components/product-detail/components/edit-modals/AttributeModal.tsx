import { FC, useEffect } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';
import { Product, ProductCategory } from '@medusajs/medusa';
import { useAdminUpdateProduct } from 'medusa-react';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import MediaForm from '@/modules/products/components/products-modal/components/MediaForm';
import AttributeForm from '@/modules/products/components/products-modal/components/AttributeForm';
import { getErrorMessage } from '@/lib/utils';
import { DimensionsFormType, CustomsFormType } from '@/types/products';

type Props = {
	product: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

type AttributeFormProps = {
	dimensions: DimensionsFormType;
	customs: CustomsFormType;
}

const AttributeModal = ({ product, state, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const updateProduct = useAdminUpdateProduct(product?.id);
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		form.setFieldsValue({
			dimensions: {
				width: product?.width || undefined,
				length: product?.length || undefined,
				height: product?.height || undefined,
				weight: product?.weight || undefined,
			},
			customs: {
				mid_code: product?.mid_code || undefined,
				hs_code: product?.hs_code || undefined,
				origin_country: product?.origin_country || undefined,
			},
		});
	}, [product]);

	const onFinish: FormProps<AttributeFormProps>['onFinish'] = async (values) => {
		const payload = {
			// Dimensions
			width: values?.dimensions?.width || undefined,
			length: values?.dimensions?.length || undefined,
			height: values?.dimensions?.height || undefined,
			weight: values?.dimensions?.weight || undefined,
			// Customs
			hs_code: values?.customs?.hs_code || undefined,
			mid_code: values?.customs?.mid_code || undefined,
			origin_country: values?.customs?.origin_country || undefined,
		};

		updateProduct.mutate(payload, {
			onSuccess: () => {
				messageApi.success('Chỉnh sửa thuộc tính thành công');
				handleOk();
			},
			onError: (error) => {
				messageApi.error(getErrorMessage(error));
			},
		});
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			isLoading={updateProduct.isLoading}
			handleCancel={handleCancel}
			// width={800}
			form={form}
		>
			{contextHolder}
			<Title level={3} className="text-center">
				{`Chỉnh sửa thuộc tính`}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-3">
				<AttributeForm />
			</Form>
		</SubmitModal>
	);
};

export default AttributeModal;
