import useIsDesktop from '@/lib/hooks/useIsDesktop';
import {
	StepModal,
	StepModalProvider,
} from '@/lib/providers/stepped-modal-provider';
import { getErrorMessage } from '@/lib/utils';
import { message } from 'antd';
import { useAdminCreateDraftSupplierOrder } from '@/lib/hooks/api/draft-sorders';
import { FC } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import { useUser } from '@/lib/providers/user-provider';
import Items from '../new/items';
import SelectRegion from '../new/select-region';
import ShippingDetails from '../new/shipping-details';
import Summary from '../new/summary';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	setIsSendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const DraftOrderModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	setIsSendEmail,
}) => {
	const { mutate } = useAdminCreateDraftSupplierOrder();
	const isDesktop = useIsDesktop();
	const { user } = useUser();
	const {
		form,
		context: { items },
	} = useNewDraftOrderForm();

	const steps = [
		{ title: '', content: <SelectRegion /> },
		{ title: '', content: <ShippingDetails /> },
		{ title: '', content: <Items /> },
		{ title: '', content: <Summary setIsSendEmail={setIsSendEmail} /> },
	];

	const handleFinish = async () => {
		try {
			const values = form.getFieldsValue(true);
			const transformedData = {
				supplier_id: values.supplier_id,
				user_id: user?.id || '',
				email: values.email,
				region_id: values.region,
				country_code: 'vn',
				currency_code: 'vnd',
				line_items: items.map((i: any) => ({
					variant_id: i.variant_id,
					quantity: i.quantity,
					unit_price: i.unit_price,
					metadata: i.metadata,
				})),
				estimated_production_time: values.estimated_production_time,
				settlement_time: values.settlement_time,
				shipping_started_date: values.shipping_started_date,
				warehouse_entry_date: values.warehouse_entry_date,
				completed_payment_date: values.completed_payment_date,
				metadata: values.metadata,
			};

			mutate(transformedData as any, {
				onSuccess: () => {
					message.success('Tạo bản nháp đơn hàng thành công');
					form.resetFields();
					handleOk();
				},
				onError: (error) => {
					message.error('Đã xảy ra lỗi khi tạo bản nháp đơn hàng');
					console.log('error', getErrorMessage(error));
				},
			});
		} catch (error) {
			console.log('error catch', error);
		}
	};

	return (
		<StepModalProvider>
			<StepModal
				open={state}
				onCancel={handleCancel}
				title="Tạo bản nháp đơn hàng"
				steps={steps}
				onFinish={handleFinish}
				isMobile={!isDesktop}
			/>
		</StepModalProvider>
	);
};

export default DraftOrderModal;
