import { FC } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import MediaForm from '@/modules/products/components/products-modal/components/MediaForm';

type Props = {
	images?: string;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

const MediaModal = ({ images, state, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();

	const onFinish: FormProps<any>['onFinish'] = async (values) => {
		console.log('thu', values);
	};

	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			// confirmLoading={isLoading}
			handleCancel={handleCancel}
			// width={800}
			form={form}
		>
			<Title level={3} className="text-center">
				{`Chỉnh sửa media`}
			</Title>
			<Form
				form={form}
				onFinish={onFinish}
				className="pt-3"
				initialValues={getDefaultValues(images)}
			>
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
