import { useContext } from 'react';
import { useDiscountForm } from '../../discount-form/discount-form-context';
import LayeredModal, {
	LayeredModalContext,
} from '@/lib/providers/layer-modal-provider';
import { Button } from '@/components/Button';
import { Form } from 'antd';
import { DiscountFormValues } from '@/types/discount';
import DiscoutForm from '../../discount-form';

type AddDiscountModalProps = {
	state: boolean;
	handleCancel: () => void;
};
const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
	state,
	handleCancel,
}) => {
	const { form } = useDiscountForm();
	const layeredModalContext = useContext(LayeredModalContext);

	// Handle submit form
	const onFinish = async (values: DiscountFormValues) => {
		console.log('values', values);
	};

	// Modal: Render footer buttons
	const footer = (
		<div className="flex items-center justify-end gap-2">
			<Button
				onClick={handleCancel}
				type="text"
				className="text-sm w-32 font-semibold justify-center"
			>
				Hủy
			</Button>
			<Button className="text-sm w-32 justify-center">Đồng ý</Button>
		</div>
	);

	return (
		<LayeredModal
			context={layeredModalContext}
			onCancel={handleCancel}
			open={state}
			footer={footer}
			title="Thêm mã giảm giá"
			className="layered-modal"
			width={800}
		>
			<Form form={form} onFinish={onFinish}>
				<DiscoutForm closeForm={handleCancel} />
			</Form>
		</LayeredModal>
	);
};

export default AddDiscountModal;
