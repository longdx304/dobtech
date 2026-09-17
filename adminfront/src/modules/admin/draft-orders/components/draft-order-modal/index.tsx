import useIsDesktop from '@/lib/hooks/useIsDesktop';
import {
	StepModal,
	StepModalProvider,
	useStepModal,
} from '@/lib/providers/stepped-modal-provider';
import { getErrorMessage } from '@/lib/utils';
import InvoiceAllocation from '@/modules/admin/orders/components/orders/new-order/invoice-allocation';
import type { NewOrderInvoicePart } from '@/modules/admin/orders/components/orders/new-order/invoice-allocation-utils';
import { Form, message } from 'antd';
import { useAdminCreateDraftOrder } from 'medusa-react';
import { FC, useEffect, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import ItemsDraft from '../new/items-draft';
import SelectRegion from '../new/select-region';
import ShippingDetails from '../new/shipping-details';
import Summary from '../new/summary';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	setIsSendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

type DraftLineItem = {
	quantity: number;
	variant_id: string;
	title: string;
	unit_price: number;
	thumbnail?: string | null;
	product_title?: string;
	sku?: string | null;
};

type InvoiceStepProps = {
	customerId?: string;
	onCustomerIdChange?: (customerId?: string) => void;
	items: DraftLineItem[];
	invoiceParts: NewOrderInvoicePart[];
	onInvoicePartsChange: (parts: NewOrderInvoicePart[]) => void;
};

const CustomerInvoiceStep = ({
	customerId,
	onCustomerIdChange,
	items,
	invoiceParts,
	onInvoicePartsChange,
}: InvoiceStepProps) => {
	const { enableNext, disableNext } = useStepModal();
	const [shippingValid, setShippingValid] = useState(false);
	const [invoiceValid, setInvoiceValid] = useState(false);

	useEffect(() => {
		if (shippingValid && invoiceValid) enableNext();
		else disableNext();
	}, [disableNext, enableNext, invoiceValid, shippingValid]);

	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
			<section className="rounded-xl border border-gray-200 bg-white p-4">
				<h3 className="mb-4 text-base font-semibold">Khách hàng và giao hàng</h3>
				<ShippingDetails
					onValidityChange={setShippingValid}
					onCustomerIdChange={onCustomerIdChange}
				/>
			</section>
			<section className="rounded-xl border border-gray-200 bg-white p-4">
				<InvoiceAllocation
					mode="profiles"
					customerId={customerId}
					items={items}
					value={invoiceParts}
					onChange={onInvoicePartsChange}
					onValidityChange={setInvoiceValid}
				/>
			</section>
		</div>
	);
};

const ItemsInvoiceStep = ({
	customerId,
	items,
	invoiceParts,
	onInvoicePartsChange,
}: InvoiceStepProps) => {
	const { enableNext, disableNext } = useStepModal();
	const [itemsValid, setItemsValid] = useState(false);
	const [invoiceValid, setInvoiceValid] = useState(false);

	useEffect(() => {
		if (itemsValid && invoiceValid) enableNext();
		else disableNext();
	}, [disableNext, enableNext, invoiceValid, itemsValid]);

	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(700px,1.55fr)_minmax(380px,0.85fr)]">
			<section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
				<h3 className="px-4 pt-4 text-base font-semibold">Sản phẩm</h3>
				<ItemsDraft onValidityChange={setItemsValid} />
			</section>
			<section className="rounded-xl border border-gray-200 bg-white p-4">
				<InvoiceAllocation
					mode="quantities"
					customerId={customerId}
					items={items}
					value={invoiceParts}
					onChange={onInvoicePartsChange}
					onValidityChange={setInvoiceValid}
				/>
			</section>
		</div>
	);
};

function resolveDraftCustomerId(raw: unknown): string | undefined {
	if (typeof raw === 'string') {
		const value = raw.trim();
		return value || undefined;
	}
	if (typeof raw === 'object' && raw !== null && 'value' in raw) {
		const value = (raw as { value?: unknown }).value;
		if (typeof value === 'string') {
			const trimmed = value.trim();
			return trimmed || undefined;
		}
	}
	return undefined;
}

/** Form may store country as string (e.g. "vn") or Select option { label, value }. */
function draftOrderCountryCode(raw: unknown, fallback = 'vn'): string {
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

const DraftOrderModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	setIsSendEmail,
}) => {
	const { mutate } = useAdminCreateDraftOrder();
	const isDesktop = useIsDesktop();
	const {
		form,
		context: {
			items,
			setItems,
			setDataFromExcel,
			shippingPolicyQuote,
			isShippingPolicyLoading,
			shippingPolicyError,
		},
	} = useNewDraftOrderForm();
	const [invoiceParts, setInvoiceParts] = useState<NewOrderInvoicePart[]>([]);
	const [persistedCustomerId, setPersistedCustomerId] = useState<string>();
	const watchedCustomerId = Form.useWatch('customer_id', form);
	const watchedId = resolveDraftCustomerId(watchedCustomerId);

	useEffect(() => {
		if (watchedId) setPersistedCustomerId(watchedId);
	}, [watchedId]);

	const customerId = watchedId ?? persistedCustomerId;
	const resetDraftState = () => {
		form.resetFields();
		setItems([]);
		setDataFromExcel([]);
		setInvoiceParts([]);
		setPersistedCustomerId(undefined);
		setIsSendEmail(false);
	};
	const handleModalCancel = () => {
		resetDraftState();
		handleCancel();
	};

	const steps = [
		{ title: '', content: <SelectRegion /> },
		{
			title: '',
			content: (
				<CustomerInvoiceStep
					customerId={customerId}
					onCustomerIdChange={setPersistedCustomerId}
					items={items}
					invoiceParts={invoiceParts}
					onInvoicePartsChange={setInvoiceParts}
				/>
			),
		},
		{
			title: '',
			content: (
				<ItemsInvoiceStep
					customerId={customerId}
					items={items}
					invoiceParts={invoiceParts}
					onInvoicePartsChange={setInvoiceParts}
				/>
			),
		},
		{
			title: '',
			content: (
				<Summary
					setIsSendEmail={setIsSendEmail}
					invoiceParts={invoiceParts}
					customerId={customerId}
				/>
			),
		},
	];

	const handleFinish = async () => {
		try {
			if (isShippingPolicyLoading) {
				message.info('Đang tính phí vận chuyển, vui lòng thử lại sau ít giây.');
				return;
			}
			if (shippingPolicyError) {
				message.error(
					'Cấu hình phí vận chuyển đang bị hở hoặc chồng khoảng giá trị.'
				);
				return;
			}

			const values = form.getFieldsValue(true);
			const shippingOptionId = shippingPolicyQuote?.configured
				? shippingPolicyQuote.option.id
				: values.shipping_option;
			if (!shippingOptionId) {
				message.error('Vui lòng chọn hoặc cấu hình phương thức vận chuyển.');
				return;
			}
			const transformedData = {
				email: values.email,
				items: items.map((i: any) => ({
					quantity: i.quantity,
					...(i.variant_id
						? { variant_id: i.variant_id, unit_price: i.unit_price }
						: { title: i.title, unit_price: i.unit_price }),
				})),
				region_id: values.region,
				shipping_methods: [{ option_id: shippingOptionId }],
				shipping_address: values.shipping_address_id || {
					...values.shipping_address,
					country_code: draftOrderCountryCode(
						values.shipping_address?.country_code
					),
				},
				billing_address: values.billing_address_id || {
					...values.billing_address,
					country_code: draftOrderCountryCode(
						values.billing_address?.country_code
					),
				},
				customer_id: resolveDraftCustomerId(values.customer_id) ?? customerId,
				discounts: values.discount_code
					? [{ code: values.discount_code }]
					: undefined,
				metadata: {
					invoice_parts: invoiceParts.map((part) => ({
						profile_id: part.profile_id,
						consumer_name: part.consumer_name,
						consumer_address: part.consumer_address,
						items: Object.entries(part.quantities)
							.filter(([, quantity]) => quantity > 0)
							.map(([variant_id, quantity]) => ({ variant_id, quantity })),
					})),
				},
			};

			mutate(transformedData as any, {
				onSuccess: () => {
					message.success('Tạo bản nháp đơn hàng thành công');
					resetDraftState();
					handleOk();
				},
				onError: (error) => {
					const errorMessage = getErrorMessage(error);
					message.error(errorMessage, 8);
					console.error('Create draft order error', errorMessage);
				},
			});
		} catch (error) {
			message.error(getErrorMessage(error), 8);
			console.error('Create draft order error', error);
		}
	};

	return (
		<StepModalProvider>
			<StepModal
				open={state}
				onCancel={handleModalCancel}
				title="Tạo bản nháp đơn hàng"
				steps={steps}
				onFinish={handleFinish}
				isMobile={!isDesktop}
				desktopWidth={1400}
				desktopBodyMaxHeight="75vh"
			/>
		</StepModalProvider>
	);
};

export default DraftOrderModal;
