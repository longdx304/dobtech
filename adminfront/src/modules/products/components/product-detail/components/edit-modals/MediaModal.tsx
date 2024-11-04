import { Product } from '@medusajs/medusa';
import { Form, FormProps, message } from 'antd';
import _ from 'lodash';
import { useAdminUpdateProduct, useMedusa } from 'medusa-react';
import { FC, useEffect } from 'react';
import { prepareImages } from '@/actions/images';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import MediaForm from '@/modules/products/components/products-modal/components/MediaForm';
import { FormImage } from '@/types/common';
import { MediaFormType } from '@/types/products';

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
	const { client } = useMedusa();

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
	}, [product, state]);

	const checkUrlMatch = (
		images: FormImage[],
		productImages: Product['images']
	) => {
		const urls = productImages?.map((image) => image.url) || [];
		const newUrls = images?.map((image) => image.url) || [];
		return _.isEqual(urls, newUrls);
	};

	const toDeleteImage = async ({
		product,
		newProduct,
	}: {
		product: Product;
		newProduct: Product;
	}) => {
		const oldImagesIds = product?.images?.map((image) => image.id) || null;
		const newImagesIds = newProduct?.images?.map((image) => image.id) || null;

		const toDeleteIds = oldImagesIds.filter((id) => !newImagesIds.includes(id));

		if (product?.metadata?.variant_images && toDeleteIds?.length) {
			const variantImages = JSON.parse(
				product?.metadata?.variant_images as string
			);

			const updateVariantImgs = variantImages?.filter(
				(variantImg: any) => !toDeleteIds.includes(variantImg.image_id)
			);

			await client.admin.products
				.setMetadata(product.id, {
					key: 'variant_images',
					value: JSON.stringify(updateVariantImgs),
				})
				.catch((err) => {
					message.error(getErrorMessage(err));
				});
		}
	};

	const onFinish: FormProps<MediaFormProps>['onFinish'] = async (values) => {
		if (checkUrlMatch(values?.media, product?.images)) {
			handleOk();
			return;
		}
		if (values?.media?.length) {
			let payload: Record<string, unknown> = {};
			let preppedImages: FormImage[] = [];
			try {
				const currentImagesUrls =
					product?.images?.map((image) => image.url) ?? null;
				preppedImages = await prepareImages(values.media, currentImagesUrls);
			} catch (error) {
				messageApi.error('Đã xảy ra lỗi khi tải hình ảnh lên.');
				return;
			}

			const urls = preppedImages.map((img) => img.url);
			payload.images = urls;
			await updateProduct.mutateAsync(payload, {
				onSuccess: async ({ product: newProduct }) => {
					await toDeleteImage({ product, newProduct });
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
