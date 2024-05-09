import { FC } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { Upload } from '@/components/Upload';
import ThumbnailForm from '@/modules/products/components/products-modal/components/ThumbnailForm';

type Props = {
	thumbnail?: string;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

const ThumbnailModal = ({ thumbnail, state, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();

	const onFinish: FormProps<any>['onFinish'] = async (values) => {
		console.log('thu', values)
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
				{`Chỉnh sửa thumbnail`}
			</Title>
			<Form
				form={form}
				onFinish={onFinish}
				className="pt-3"
				initialValues={getDefaultValues(thumbnail)}
			>
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
