import { Product } from '@medusajs/medusa';
import { Form, FormProps, message } from 'antd';
import { useAdminUpdateProduct } from 'medusa-react';
import { FC, useEffect } from 'react';

import { prepareImages, deleteImages } from '@/actions/images';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import ThumbnailForm from '@/modules/products/components/products-modal/components/ThumbnailForm';
import { FormImage } from '@/types/common';
import { ThumbnailFormType } from '@/types/products';

type Props = {
	product: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

type ThumbnailFormProps = {
	thumbnail: ThumbnailFormType;
};

const ThumbnailModal: FC<Props> = ({
	product,
	state,
	handleOk,
	handleCancel,
}) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const updateProduct = useAdminUpdateProduct(product?.id);

	useEffect(() => {
		form.setFieldsValue({
			thumbnail: product?.thumbnail
				? [
						{
							url: product?.thumbnail,
							name: 'Hình ảnh',
						},
				  ]
				: [],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, state]);

	const handleDeleteFile = async (url: string) => {
		await deleteImages(url);
	};

	const onFinish: FormProps<ThumbnailFormProps>['onFinish'] = async (
		values
	) => {
		// Check if thumbnail is the same
		if (values?.thumbnail[0]?.url === product?.thumbnail) {
			handleOk();
			return;
		}
		// Prepped images thumbnail
		if (values.thumbnail?.length) {
			let payload: Record<string, unknown> = {};
			let preppedImages: FormImage[] = [];
			try {
				preppedImages = await prepareImages(values.thumbnail, [
					product?.thumbnail || '',
				]);
			} catch (error) {
				console.log('error:', error);
				messageApi.error('Đã xảy ra lỗi khi tải hình ảnh lên.');
				return;
			}
			const urls = preppedImages.map((img) => img.url);
			payload.thumbnail = urls[0];
			await updateProduct.mutateAsync(payload, {
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
