import { useAdminAddCustomerAddress } from '@/lib/hooks/api/customer/mutations';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import {
	StepModal,
	StepModalProvider,
} from '@/lib/providers/stepped-modal-provider';
import { getErrorMessage } from '@/lib/utils';
import Items from '@/modules/draft-orders/components/new/items';
import SelectRegion from '@/modules/draft-orders/components/new/select-region';
import SelectShipping from '@/modules/draft-orders/components/new/select-shipping';
import ShippingDetails from '@/modules/draft-orders/components/new/shipping-details';
import Summary from '@/modules/draft-orders/components/new/summary';
import { useAdminDraftOrderTransferOrder } from '@/modules/draft-orders/hooks';
import { useNewDraftOrderForm } from '@/modules/draft-orders/hooks/use-new-draft-form';
import { message } from 'antd';
import { useAdminCreateDraftOrder, useAdminCustomer } from 'medusa-react';
import { FC, useState } from 'react';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	refetch: () => void;
};

const NewOrderModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	refetch,
}) => {
	const { mutate: createDraftOrder } = useAdminCreateDraftOrder();
	const isDesktop = useIsDesktop();
	const {
		form,
		context: { items },
	} = useNewDraftOrderForm();

	// State to store the created draft order ID
	const [createdDraftOrderId, setCreatedDraftOrderId] = useState<string | null>(
		null
	);

	// Initialize transfer order mutation
	const transferOrder = useAdminDraftOrderTransferOrder(
		createdDraftOrderId || ''
	);

	// get customer user
	const customerIdFromForm = form.getFieldValue('customer_id');
	const { customer } = useAdminCustomer(customerIdFromForm || '', {
		enabled: !!customerIdFromForm,
	});

	// Initialize add customer address mutation
	const adminAddCustomerAddress = useAdminAddCustomerAddress(
		customer?.id || ''
	);

	const steps = [
		{ title: '', content: <SelectRegion /> },
		{ title: '', content: <ShippingDetails /> },
		{ title: '', content: <Items /> },
		{ title: '', content: <SelectShipping /> },
		{ title: '', content: <Summary /> },
	];

	const handleFinish = async () => {
		try {
			const values = form.getFieldsValue(true);

			// add shipping address for customer if not exist
			if (customer && customer.shipping_addresses.length === 0) {
				const shipping_addresses = {
					first_name: values.shipping_address.first_name,
					last_name: values.shipping_address.last_name,
					phone: values.shipping_address.phone,
					address_1: values.shipping_address.address_1,
					address_2: values.shipping_address.address_2,
					city: values.shipping_address.city,
					company: values.shipping_address.company,
					province: values.shipping_address.province,
					postal_code: values.shipping_address.postal_code,
					country_code: values.shipping_address.country_code.value,
					metadata: { is_default: true },
				};

				adminAddCustomerAddress.mutate(shipping_addresses, {
					onSuccess: (response) => {
						console.log('Address added successfully', response);
					},
					onError: (error) => {
						console.error('Failed to add address', error);
					},
				});
			}

			// for create draft order by admin
			const transformedData = {
				email: values.email,
				items: items.map((i: any) => ({
					quantity: i.quantity,
					...(i.variant_id
						? { variant_id: i.variant_id, unit_price: i.unit_price }
						: { title: i.title, unit_price: i.unit_price }),
				})),
				region_id: values.region,
				shipping_methods: [{ option_id: values.shipping_option }],
				shipping_address: values.shipping_address_id || {
					...values.shipping_address,
					country_code: values.shipping_address?.country_code?.value || 'vn',
				},
				billing_address: values.billing_address_id || {
					...values.billing_address,
					country_code: values.billing_address?.country_code?.value || 'vn',
				},
				customer_id: values.customer_id,
				discounts: values.discount_code
					? [{ code: values.discount_code }]
					: undefined,
			};

			// create draft order && transfer to order
			createDraftOrder(transformedData as any, {
				onSuccess: (response) => {
					// Use a callback to ensure transfer happens after state is set
					setCreatedDraftOrderId((currentId) => {
						const newDraftOrderId = response.draft_order.id;

						// Immediately trigger transfer order mutation
						transferOrder.mutate(void 0, {
							onSuccess: () => {
								refetch();
								form.resetFields();
								handleOk();
							},
							onError: (error) => {
								console.error('Transfer order error', getErrorMessage(error));
							},
						});

						return newDraftOrderId;
					});

					message.success('Admin tạo đơn hàng thành công');
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
				title="Admin tạo đơn hàng"
				steps={steps}
				onFinish={handleFinish}
				isMobile={!isDesktop}
			/>
		</StepModalProvider>
	);
};

export default NewOrderModal;
