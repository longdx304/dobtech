// @ts-nocheck
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import AddProductVariant from '@/modules/supplier/common/add-product-variant';
import { ProductVariant } from '@medusajs/medusa';
import { message } from 'antd';

import { useAdminSupplierOrderUpdateLineItem } from '@/modules/supplier/hooks';
import {
	UpdateLineItem,
	UpdateLineItemSupplierOrderReq,
	AddOrderEditLineItemInput,
} from '@/types/supplier';
import { formatAmountWithSymbol } from '@/utils/prices';
import { useGetCart } from 'medusa-react';
import { useEffect, useRef, useState } from 'react';
import { useSupplierOrderEdit } from './context';
import SupplierOrderEditLine from './supplier-order-edit-line';
import {
	useAdminDeleteSupplierOrderEdit,
	useAdminRequestSOrderEditConfirmation,
	useAdminSupplierOrderEditAddLineItem,
	useAdminUpdateSupplierOrderEdit,
} from '@/modules/supplier/hooks/supplier-order-edits';
import { Input } from '@/components/Input';

type SupplierOrderEditModalContainerProps = {
	supplierOrder: SupplierOrder | null;
};

const SupplierOrderEditModalContainer = (
	props: SupplierOrderEditModalContainerProps
) => {
	const { supplierOrder } = props;

	const {
		isModalVisible,
		hideModal,
		orderEdits,
		supplierOrderEdits,
		activeOrderEditId,
		setActiveOrderEditId,
	} = useSupplierOrderEdit();

	const supplierOrderEdit = supplierOrderEdits?.find(
		(oe) => oe.id === activeOrderEditId
	);

	const onClose = () => {
		hideModal();
	};

	if (!supplierOrderEdit) {
		return null;
	}

	return (
		<SupplierOrderEditModal
			state={isModalVisible}
			close={onClose}
			supplierOrderEdit={supplierOrderEdit}
			currentSubtotal={1000}
			regionId={supplierOrder?.cart?.region_id}
			customerId={supplierOrder?.user?.id}
			currencyCode={'vnd'}
			paidTotal={1000}
		/>
	);
};

export default SupplierOrderEditModalContainer;

type SupplierOrderEditModalProps = {
	state: boolean;
	close: () => void;
	supplierOrderEdit: SupplierOrderEdit;
	currencyCode?: string;
	regionId?: string;
	customerId?: string;
	currentSubtotal?: number;
	paidTotal?: number;
};

const SupplierOrderEditModal = (props: OrderEditModalProps) => {
	const {
		state,
		close,
		supplierOrderEdit,
		currencyCode,
		regionId,
		customerId,
		currentSubtotal,
		paidTotal,
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
	const [itemQuantities, setItemQuantities] = useState<ItemQuantity[]>([]);
	const [itemPrices, setItemPrices] = useState<ItemPrice[]>([]);

	const showTotals = currentSubtotal !== 1000;
	const hasChanges = !!supplierOrderEdit?.changes?.length;

	const {
		mutateAsync: requestConfirmation,
		isLoading: isRequestingConfirmation,
	} = useAdminRequestSOrderEditConfirmation(supplierOrderEdit?.id);

	const { mutateAsync: updateOrderEdit, isLoading: isUpdating } =
		useAdminUpdateSupplierOrderEdit(supplierOrderEdit?.id);

	const { mutateAsync: deleteOrderEdit } = useAdminDeleteSupplierOrderEdit(
		supplierOrderEdit?.id
	);

	const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
		useAdminSupplierOrderEditAddLineItem(supplierOrderEdit?.id);

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
		// Creating the lineItems array by merging quantities and prices
		const lineItems: AddOrderEditLineItemInput[] = selectedVariants.map(
			(variantId) => {
				const quantityData = itemQuantities.find(
					(item) => item.variantId === variantId
				);
				const priceData = itemPrices.find(
					(item) => item.variantId === variantId
				);

				return {
					variant_id: variantId,
					quantity: quantityData?.quantity || 0,
					unit_price: priceData?.unit_price || 0,
				};
			}
		);

		try {
			const promises = lineItems.map((lineItem) =>
				addLineItem({
					variant_id: lineItem.variant_id,
					quantity: lineItem.quantity,
					unit_price: lineItem.unit_price,
				})
			);

			await Promise.all(promises);
			message.success('Thêm biến thể sản phẩm thành công');
		} catch (e: any) {
			console.log('Error:', e);
			message.error('Có lỗi xảy ra');
		}
	};

	let displayItems =
		supplierOrderEdit?.items?.sort(
			// @ts-ignore
			(a, b) => new Date(a.created_at) - new Date(b.created_at)
		) || [];

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
				{displayItems?.map((oi) => (
					<SupplierOrderEditLine
						key={oi.id}
						item={oi}
						customerId={customerId}
						regionId={regionId}
						currencyCode={currencyCode}
						change={
							supplierOrderEdit?.changes?.find(
								(change) =>
									change.line_item_id === oi.id ||
									change.original_line_item_id === oi.id
							) || undefined
						}
					/>
				))}
				{/* TOTALS */}
				{showTotals && (
					<TotalsSection currencyCode={currencyCode} amountPaid={paidTotal} />
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
				itemQuantities={itemQuantities}
				itemPrices={itemPrices}
				setItemQuantities={setItemQuantities}
				setItemPrices={setItemPrices}
			/>
		</Modal>
	);
};

type TotalsSectionProps = {
	amountPaid: number;
	currencyCode: string;
};

/**
 * Totals section displaying order and order edit subtotals.
 */
function TotalsSection(props: TotalsSectionProps) {
	const { currencyCode, amountPaid } = props;

	return (
		<>
			<div className="bg-gray-200 mb-6 w-full" />

			<div className="mb-2 flex h-[40px] justify-between">
				<span className="font-semibold text-gray-900">{'Tổng tiền'}</span>
				<span className="text-2xl font-semibold">
					{formatAmountWithSymbol({
						amount: amountPaid,
						currency: currencyCode,
					})}
				</span>
			</div>

			<div className="bg-gray-200 mt-8 mb-6 h-px w-full" />
		</>
	);
}
