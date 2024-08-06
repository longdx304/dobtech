// @ts-nocheck
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { formatAmountWithSymbol } from '@/utils/prices';
import { Order, OrderEdit, ProductVariant } from '@medusajs/medusa';
import { message } from 'antd';
import clsx from 'clsx';
import {
	useAdminDeleteOrderEdit,
	useAdminOrderEditAddLineItem,
	useAdminRequestOrderEditConfirmation,
	useAdminUpdateOrderEdit,
} from 'medusa-react';
import { useEffect, useRef, useState } from 'react';
import AddProductVariant from '../../common/add-product-variant';
import { useOrderEdit } from './context';
import OrderEditLine from './order-edit-line';

type OrderEditModalContainerProps = {
	order: Order;
};

let isRequestRunningFlag = false;

const OrderEditModalContainer = (props: OrderEditModalContainerProps) => {
	const { order } = props;

	const {
		isModalVisible,
		hideModal,
		orderEdits,
		activeOrderEditId,
		setActiveOrderEditId,
	} = useOrderEdit();

	const orderEdit = orderEdits?.find((oe) => oe.id === activeOrderEditId);

	const onClose = () => {
		// setActiveOrderEdit(undefined) -> context will unset active edit after flag toggle
		hideModal();
	};

	if (!orderEdit) {
		return null;
	}

	return (
		<OrderEditModal
			state={isModalVisible}
			close={onClose}
			orderEdit={orderEdit}
			currentSubtotal={order.subtotal}
			regionId={order.region_id}
			customerId={order.customer_id}
			currencyCode={order.currency_code}
			paidTotal={order.paid_total}
			refundedTotal={order.refunded_total}
		/>
	);
};

export default OrderEditModalContainer;

type OrderEditModalProps = {
	close: () => void;
	orderEdit: OrderEdit;
	currencyCode: string;
	regionId: string;
	customerId: string;
	currentSubtotal: number;
	paidTotal: number;
	refundedTotal: number;
	state: boolean;
};

const OrderEditModal = (props: OrderEditModalProps) => {
	const {
		state,
		close,
		currentSubtotal,
		orderEdit,
		currencyCode,
		regionId,
		customerId,
		paidTotal,
		refundedTotal,
	} = props;

	const {
		state: stateAddProduct,
		onOpen: openAddProduct,
		onClose: closeAddProduct,
	} = useToggleState(false);

	const filterRef = useRef();
	const [note, setNote] = useState<string | undefined>();
	const [showFilter, setShowFilter] = useState(false);
	const [filterTerm, setFilterTerm] = useState<string>('');

	const showTotals = currentSubtotal !== orderEdit?.subtotal;
	const hasChanges = !!orderEdit?.changes?.length;

	const {
		mutateAsync: requestConfirmation,
		isLoading: isRequestingConfirmation,
	} = useAdminRequestOrderEditConfirmation(orderEdit.id);

	const { mutateAsync: updateOrderEdit, isLoading: isUpdating } =
		useAdminUpdateOrderEdit(orderEdit.id);

	const { mutateAsync: deleteOrderEdit } = useAdminDeleteOrderEdit(
		orderEdit.id
	);

	const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
		useAdminOrderEditAddLineItem(orderEdit.id);

	const onSave = async () => {
		try {
			await requestConfirmation();
			if (note) {
				await updateOrderEdit({ internal_note: note });
			}

			message.success('Đặt chỉnh sửa đơn hàng như đã yêu cầu');
		} catch (e: any) {
			message.error('Yêu cầu xác nhận thất bại');
		}
		close();
	};

	const onCancel = async () => {
		// NOTE: has to be this order of ops
		await deleteOrderEdit();
		close();
	};

	useEffect(() => {
		if (showFilter) {
			filterRef?.current?.focus();
		}
	}, [showFilter]);

	const onAddVariants = async (selectedVariants: ProductVariant['id']) => {
		try {
			const promises = selectedVariants.map((variantId: any) =>
				addLineItem({ variant_id: variantId, quantity: 1 })
			);

			await Promise.all(promises);

			message.success('Thêm biến thể sản phẩm thành công.');
		} catch (e: any) {
			message.error('Có lỗi xảy ra');
		}
	};

	const hideFilter = () => {
		if (showFilter) {
			setFilterTerm('');
		}
		setShowFilter((s) => !s);
	};

	let displayItems = orderEdit.items.sort(
		// @ts-ignore
		(a, b) => new Date(a.created_at) - new Date(b.created_at)
	);

	if (filterTerm) {
		displayItems = displayItems.filter(
			(i) =>
				i.title.toLowerCase().includes(filterTerm) ||
				i.variant?.sku.toLowerCase().includes(filterTerm)
		);
	}

	return (
		<Modal
			open={state}
			handleOk={onSave}
			isLoading={isUpdating || isRequestingConfirmation}
			disabled={isUpdating || isRequestingConfirmation || !hasChanges}
			handleCancel={onCancel}
			width={800}
		>
			<Title level={3} className="text-center">
				{'Chỉnh sửa đơn hàng'}
			</Title>
			<Flex justify="flex-end" className="text-xs pt-4">
				<Button type="default" className="w-fit" onClick={openAddProduct}>
					{'Thêm sản phẩm'}
				</Button>
			</Flex>
			<div className="flex flex-col mt-4">
				{/* ITEMS */}
				{displayItems.map((oi) => (
					<OrderEditLine
						key={oi.id}
						item={oi}
						customerId={customerId}
						regionId={regionId}
						currencyCode={currencyCode}
						change={orderEdit.changes.find(
							(change) =>
								change.line_item_id === oi.id ||
								change.original_line_item_id === oi.id
						)}
					/>
				))}
				{/* TOTALS */}
				{showTotals && (
					<TotalsSection
						currencyCode={currencyCode}
						amountPaid={paidTotal - refundedTotal}
						newTotal={orderEdit.total}
						differenceDue={
							// TODO: more correct would be to have => diff_due = orderEdit_total_of_items_user_is_getting - paid_total + refunded_total
							orderEdit.total - paidTotal // (orderEdit_total - refunded_total) - (paidTotal - refundedTotal)
						}
					/>
				)}
				{/* NOTE */}
				{hasChanges && (
					<div className="flex items-center justify-between">
						<span className="text-gray-500">{'Ghi chú'}</span>
						<Input
							className="max-w-[455px]"
							placeholder="Thêm ghi chú"
							onChange={(value: any) => setNote(value)}
							value={note}
						/>
					</div>
				)}
			</div>
			<AddProductVariant
				title="Thêm biến thể sản phẩm"
				state={stateAddProduct}
				onClose={closeAddProduct}
				onSubmit={onAddVariants}
				customerId={customerId}
				regionId={regionId}
				currencyCode={currencyCode}
				isLoading={loadingAddLineItem}
			/>
		</Modal>
	);
};

type TotalsSectionProps = {
	amountPaid: number;
	newTotal: number;
	differenceDue: number;
	currencyCode: string;
};

/**
 * Totals section displaying order and order edit subtotals.
 */
function TotalsSection(props: TotalsSectionProps) {
	const { currencyCode, amountPaid, newTotal, differenceDue } = props;

	return (
		<>
			<div className="bg-gray-200 mb-6 w-full" />
			<div className="mb-2 flex h-[40px] justify-between">
				<span className="text-gray-500">{'Số tiền đã thanh toán'}</span>
				<span className="text-gray-900">
					{formatAmountWithSymbol({
						amount: amountPaid,
						currency: currencyCode,
					})}
					<span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
				</span>
			</div>

			<div className="mb-2 flex h-[40px] justify-between">
				<span className="font-semibold text-gray-900">{'Tổng mới'}</span>
				<span className="text-2xl font-semibold">
					{formatAmountWithSymbol({
						amount: newTotal,
						currency: currencyCode,
					})}
				</span>
			</div>

			<div className="flex justify-between">
				<span className="text-gray-500">{'Sự khác biệt cần thanh toán'}</span>
				<span
					className={clsx('text-gray-900', {
						'text-rose-500': differenceDue < 0,
						'text-emerald-500': differenceDue >= 0,
					})}
				>
					{formatAmountWithSymbol({
						amount: differenceDue,
						currency: currencyCode,
					})}
					<span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
				</span>
			</div>

			<div className="bg-gray-200 mt-8 mb-6 h-px w-full" />
		</>
	);
}