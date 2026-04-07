import { useAdminAddCustomerAddress } from '@/lib/hooks/api/customer';
import { useAdminDraftOrderTransferOrder } from '@/lib/hooks/api/draft-orders';
import { useAdminUploadFile } from '@/lib/hooks/api/uploads';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import {
	StepModal,
	StepModalProvider,
} from '@/lib/providers/stepped-modal-provider';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import Items from '@/modules/admin/draft-orders/components/new/items';
import SelectRegion from '@/modules/admin/draft-orders/components/new/select-region';
import ShippingDetails from '@/modules/admin/draft-orders/components/new/shipping-details';
import Summary from '@/modules/admin/draft-orders/components/new/summary';
import { useNewDraftOrderForm } from '@/modules/admin/draft-orders/hooks/use-new-draft-form';
import { LineItemReq } from '@/types/order';
import { AddressCreatePayload, Customer, User } from '@medusajs/medusa';
import { Form, message } from 'antd';
import { useAdminCreateDraftOrder, useAdminCustomer } from 'medusa-react';
import { FC, useState } from 'react';
import { generatePdfBlob } from './order-pdf';

export interface pdfOrderRes {
	isSendEmail?: boolean;
	lineItems: LineItemReq[];
	userId: string;
	customer?: Pick<
		Customer,
		'last_name' | 'first_name' | 'email' | 'phone'
	> | null;
	address: string;
	totalQuantity: number;
	user?: Omit<User, 'password_hash'> | null;
	email: string;
	countryCode?: string;
	metadata?: Record<string, unknown>;
}

interface LineItemForm {
	quantity: number;
	variant_id: string;
	title: string;
	unit_price: number;
	thumbnail?: string | null;
	product_title?: string;
	sku?: string | null;
}

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	refetch: () => void;
};

function orderFormCountryCode(raw: unknown, fallback = 'vn'): string {
	if (raw == null || raw === '') {
		return fallback;
	}
	if (typeof raw === 'string') {
		return raw.toLowerCase().trim();
	}
	if (typeof raw === 'object' && raw !== null && 'value' in raw) {
		const v = (raw as { value?: string }).value;
		if (v != null && v !== '') {
			return String(v).toLowerCase().trim();
		}
	}
	return fallback;
}

const NewOrderModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	refetch,
}) => {
	const { user } = useUser();
	const { mutateAsync: createDraftOrder, isLoading: loadingCreateDraftOrder } =
		useAdminCreateDraftOrder();
	const isDesktop = useIsDesktop();
	const {
		form,
		context: { items, region },
	} = useNewDraftOrderForm();
	const [isSendEmail, setIsSendEmail] = useState(false);

	// Initialize transfer order mutation
	const transferOrder = useAdminDraftOrderTransferOrder();

	// Theo dõi customer_id trên form (getFieldValue tại render không đổi khi user chọn khách)
	const watchedCustomerId = Form.useWatch('customer_id', form) as
		| string
		| undefined;
	const { customer } = useAdminCustomer(watchedCustomerId || '', {
		enabled: !!watchedCustomerId,
	});

	const adminAddCustomerAddress = useAdminAddCustomerAddress(
		watchedCustomerId || customer?.id || ''
	);

	const uploadFile = useAdminUploadFile();

	const steps = [
		{
			title: '',
			content: (
				<div className="flex flex-col">
					<SelectRegion />
				</div>
			),
		},
		{ title: '', content: <ShippingDetails /> },
		{ title: '', content: <Items /> },
		{ title: '', content: <Summary setIsSendEmail={setIsSendEmail} /> },
	];

	const generateFilePdf = async (
		customer: Pick<Customer, 'last_name' | 'first_name' | 'email' | 'phone'>,
		address: string
	): Promise<string> => {
		const values = form.getFieldsValue(true);
		let pdfReq = {} as pdfOrderRes;
		pdfReq = {
			email: values.email,
			userId: user!.id,
			user: user,
			customer,
			address,
			lineItems: items.map((i: LineItemForm) => ({
				variantId: i.variant_id,
				quantity: i.quantity,
				unit_price: i.unit_price,
				title: `${i.product_title} - ${i.title}`,
				sku: i?.sku || '',
			})),
			totalQuantity: items.reduce((acc, i) => acc + i.quantity, 0),
			countryCode: orderFormCountryCode(values.shipping_address?.country_code),
			isSendEmail: false,
		};

		// Generate pdf blob
		const pdfBlob = await generatePdfBlob(pdfReq!);

		// Create a File object
		const fileName = `purchase-order.pdf`;

		// Create a File object
		const files = new File([pdfBlob], fileName, {
			type: 'application/pdf',
		});

		// Upload pdf to s3 using Medusa uploads API
		const uploadRes = await uploadFile.mutateAsync({
			files,
			prefix: 'orders',
		});

		const pdfUrl = uploadRes.uploads[0].url;

		return pdfUrl;
	};

	const addCustomerAddress = async () => {
		const values = form.getFieldsValue(true);
		const sa = values.shipping_address;
		if (!sa?.address_1 || !sa?.first_name) {
			throw new Error('Thiếu thông tin địa chỉ giao hàng');
		}

		const payload: AddressCreatePayload = {
			first_name: sa.first_name,
			last_name: sa.last_name ?? '',
			phone: sa.phone ?? '',
			company: sa.company ?? '',
			address_1: sa.address_1,
			address_2: sa.address_2 ?? '',
			city: sa.city ?? '',
			province: sa.province ?? '',
			postal_code: sa.postal_code ?? '',
			country_code: orderFormCountryCode(sa.country_code),
			metadata: { is_default: true },
		};

		await adminAddCustomerAddress.mutateAsync(payload);
	};

	const generateTransferOrderData = (tax: number) => {
		const values = form.getFieldsValue(true);
		const taxRate = region?.tax_rate || 0;
		// for create draft order by admin
		const transformedData = {
			email: values.email,
			items: items.map((i: any) => ({
				quantity: i.quantity,
				...(i.variant_id
					? {
						variant_id: i.variant_id,
						unit_price: i.unit_price / (1 + taxRate / 100),
					}
					: { title: i.title, unit_price: i.unit_price / (1 + taxRate / 100) }),
			})),
			region_id: values.region,
			shipping_methods: [{ option_id: values.shipping_option }],
			shipping_address: values.shipping_address_id || {
				...values.shipping_address,
				country_code: orderFormCountryCode(values.shipping_address?.country_code),
			},
			billing_address: values.billing_address_id || {
				...values.billing_address,
				country_code: orderFormCountryCode(values.billing_address?.country_code),
			},
			customer_id: values.customer_id,
			discounts: values.discount_code
				? [{ code: values.discount_code }]
				: undefined,
		};

		return transformedData;
	};

	const handleFinish = async () => {
		try {
			const values = form.getFieldsValue(true);
			// Lưu địa chỉ mới vào hồ sơ khách khi không chọn địa chỉ có sẵn (kể cả đã có địa chỉ cũ).
			const shouldSaveAddressToCustomer =
				!!values.customer_id &&
				!values.shipping_address_id &&
				!!values.shipping_address?.address_1 &&
				!!values.shipping_address?.first_name;

			if (shouldSaveAddressToCustomer) {
				try {
					await addCustomerAddress();
					message.success('Đã lưu địa chỉ vào hồ sơ khách hàng');
				} catch (e) {
					message.error(
						getErrorMessage(e) || 'Không thể lưu địa chỉ khách hàng'
					);
					return;
				}
			}

			const address = `${values.shipping_address.address_1 ?? ''} ${values.shipping_address.address_2 ?? ''
				} ${values.shipping_address.province ?? ''} ${values.shipping_address.city ?? ''
				}`;

			const urlPdf = await generateFilePdf(
				{
					last_name: values.shipping_address.last_name,
					first_name: values.shipping_address.first_name,
					email: values.email,
					phone: values.shipping_address.phone,
				},
				address
			);

			// for create draft order by admin
			const transformedData = generateTransferOrderData(region?.tax_rate ?? 0);

			// create draft order && transfer to order
			await createDraftOrder(transformedData as any, {
				onSuccess: async (response) => {
					await transferOrder.mutateAsync(
						{ id: response.draft_order.id, isSendEmail: isSendEmail, urlPdf },
						{
							onSuccess: () => {
								message.success('Admin tạo đơn hàng thành công');
								refetch();
								form.resetFields();
								handleOk();
								// Refresh the page to reload prices
								window.location.reload();
							},
							onError: (error) => {
								console.error('Transfer order error', getErrorMessage(error));
							},
						}
					);
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
				loading={transferOrder.isLoading || loadingCreateDraftOrder}
			/>
		</StepModalProvider>
	);
};

export default NewOrderModal;
