import { FC, useEffect } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';
import { Product, ProductCategory } from '@medusajs/medusa';
import { useAdminUpdateProduct } from 'medusa-react';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import MediaForm from '@/modules/products/components/products-modal/components/MediaForm';
import GeneralForm from '@/modules/products/components/products-modal/components/GeneralForm';
import OrganizeForm from '@/modules/products/components/products-modal/components/OrganizeForm';
import { getErrorMessage } from '@/lib/utils';
import { OrganizeFormType, GeneralFormType } from '@/types/products';

type Props = {
	product: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	treeData: any;
};

type GeneralFormProps = {
	general: GeneralFormType;
	organize: OrganizeFormType;
}

const GeneralModal = ({ product, state, handleOk, handleCancel, treeData }) => {
	const [form] = Form.useForm();
	const updateProduct = useAdminUpdateProduct(product?.id);
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		form.setFieldsValue({
			general: {
				title: product?.title || '',
				handle: product?.handle || '',
				material: product?.material || '',
				description: product?.description || '',
				discountable: product?.discountable || true,
			},
			organize: {
				type: product?.type || '',
				collection: product?.collection || '',
				categories:
					product?.categories?.map((category) => (
						category.id,
					)) || [],
				tags: product?.tags || [],
			},
		});
	}, [product]);

	const onFinish: FormProps<GeneralFormProps>['onFinish'] = async (values) => {
		const payload = {
			title: values?.general?.title,
			subtitle: values?.general?.subtitle || undefined,
			material: values?.general?.material || undefined,
			handle: values?.general?.handle || undefined,
			description: values?.general?.description || undefined,
			discountable: values?.general?.discounted,
			collection_id: values?.organize?.collection.value || undefined,
			tags: values?.organize?.tags?.length
				? values?.organize?.tags?.map((tag) => ({ value: tag }))
				: undefined,
			categories: values?.organize?.categories?.length
				? values.organize.categories.map((category) => ({ id: category }))
				: undefined,
			type: values?.organize?.type
				? {
						value: values.organize.type.label,
						id: values.organize.type.value,
				  }
				: undefined,
		};

		updateProduct.mutate(payload, {
			onSuccess: () => {
				messageApi.success('Chỉnh sửa thông tin thành công');
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
				{`Chỉnh sửa media`}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-3">
				<GeneralForm />
				<OrganizeForm treeCategories={treeData} isEdit={true} />
			</Form>
		</SubmitModal>
	);
};

export default GeneralModal;
