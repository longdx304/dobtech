import { FC, useEffect } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';
import { Product } from '@medusajs/medusa';
import { useAdminUpdateProduct } from 'medusa-react';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import ThumbnailForm from '@/modules/products/components/products-modal/components/ThumbnailForm';
import { ThumbnailFormType } from '@/types/products';
import { prepareImages } from '@/actions/images';
import { FormImage } from '@/types/common';

type Props = {
	product: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

type ThumbnailFormProps = {
	thumbnail: ThumbnailFormType;
};

const ThumbnailModal = ({ product, state, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const updateProduct = useAdminUpdateProduct(product?.id);

	useEffect(() => {
		form.setFieldsValue({
			thumbnail: product?.thumbnail
				? [
						{
							url: product?.thumbnail,
						},
				  ]
				: [],
		});
	}, [product]);

	const onFinish: FormProps<ThumbnailFormProps>['onFinish'] = async (
		values
	) => {
		// Prepped images thumbnail
		if (values.thumbnail?.length) {
			let payload = {};
			let preppedImages: FormImage[] = [];
			try {
				preppedImages = await prepareImages(values.thumbnail);
			} catch (error) {
				messageApi.error('Đã xảy ra lỗi khi tải hình ảnh lên.');
				return;
			}
			const urls = preppedImages.map((img) => img.url);
			payload.thumbnail = urls[0];
			updateProduct.mutateAsync(payload, {
				onSuccess: () => {
					messageApi.success('Chỉnh sửa thumbnail thành công');
					handleOk();
				},
				onError: (error) => {
					messageApi.error(getErrorMessage(error));
				},
			});
		}
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			isLoading={updateProduct?.isLoading}
			handleCancel={handleCancel}
			form={form}
		>
			{contextHolder}
			<Title level={3} className="text-center">
				{`Chỉnh sửa thumbnail`}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-3">
				<ThumbnailForm form={form} />
			</Form>
		</SubmitModal>
	);
};

export default ThumbnailModal;

const getDefaultValues = (thumbnailProduct: Product['thumbnail']) => {
	return {
		thumbnail: thumbnailProduct
			? [
					{
						url: thumbnailProduct,
					},
			  ]
			: [],
	};
};
