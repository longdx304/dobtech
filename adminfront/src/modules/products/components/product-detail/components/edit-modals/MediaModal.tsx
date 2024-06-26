import { Product } from '@medusajs/medusa';
import { Form, FormProps, message } from 'antd';
import { useAdminUpdateProduct } from 'medusa-react';
import { FC, useEffect } from 'react';

import { prepareImages } from '@/actions/images';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import MediaForm from '@/modules/products/components/products-modal/components/MediaForm';
import { FormImage } from '@/types/common';
import { MediaFormType } from '@/types/products';
import { getErrorMessage } from '@/lib/utils';

type Props = {
	product: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

type MediaFormProps = {
	media: MediaFormType;
};

const MediaModal: FC<Props> = ({ product, state, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const updateProduct = useAdminUpdateProduct(product?.id);

	useEffect(() => {
		form.setFieldsValue({
			media: product?.images?.length
				? product?.images?.map((image, index) => ({
						id: image.id,
						url: image.url,
						name: `Hình ảnh ${index + 1}`,
						selected: false,
				  }))
				: [],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product]);

	const onFinish: FormProps<MediaFormProps>['onFinish'] = async (values) => {
		if (values.media?.length) {
			let payload: Record<string, unknown> = {};
			let preppedImages: FormImage[] = [];
			try {
				preppedImages = await prepareImages(values.media);
			} catch (error) {
				console.log('err', error);
				messageApi.error('Đã xảy ra lỗi khi tải hình ảnh lên.');
				return;
			}
			const urls = preppedImages.map((img) => img.url);
			payload.images = urls;
			updateProduct.mutateAsync(payload, {
				onSuccess: () => {
					messageApi.success('Chỉnh sửa media thành công');
					handleOk();
					return;
				},
				onError: (error) => {
					messageApi.error(getErrorMessage(error));
				},
			});
			return;
		}
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			isLoading={updateProduct?.isLoading}
			handleCancel={handleCancel}
			// width={800}
			form={form}
		>
			{contextHolder}
			<Title level={3} className="text-center">
				{`Chỉnh sửa media`}
			</Title>
			<Form form={form} onFinish={onFinish} className="pt-3">
				<MediaForm form={form} />
			</Form>
		</SubmitModal>
	);
};

export default MediaModal;

const getDefaultValues = (imagesProduct: Product['images']) => {
	return {
		media:
			imagesProduct?.map((image) => ({
				url: image.url,
				selected: false,
			})) || [],
	};
};
