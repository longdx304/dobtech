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
} from '@/types/supplier';
import { formatAmountWithSymbol } from '@/utils/prices';
import { useGetCart } from 'medusa-react';
import { useEffect, useRef, useState } from 'react';
import { useSupplierOrderEdit } from './context';
import SupplierOrderEditLine from './supplier-order-edit-line';
import {
	useAdminDeleteSupplierOrderEdit,
	useAdminUpdateSupplierOrderEdit,
} from '@/modules/supplier/hooks/supplier-order-edits';

type SupplierOrderEditModalContainerProps = {
	supplierOrder: SupplierOrder | null;
};

const SupplierOrderEditModalContainer = (
	props: SupplierOrderEditModalContainerProps
) => {
	const { supplierOrder } = props;
	const { cart: supplierCart, refetch } = useGetCart(
		supplierOrder?.cart?.id ?? null
	);

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
			currentSubtotal={supplierCart?.subtotal}
			regionId={supplierCart?.region_id}
			customerId={supplierOrder?.user?.id}
			currencyCode={supplierCart?.region?.currency_code}
			paidTotal={supplierCart?.total}
			refetch={refetch}
		/>
	);
};

export default SupplierOrderEditModalContainer;

type SupplierOrderEditModalProps = {
	state: boolean;
	close: () => void;
	orderEditId: string;
	supplierOrderEdit: any;
	currencyCode?: string;
	regionId?: string;
	customerId?: string;
	currentSubtotal?: number;
	paidTotal?: number;
	refetch: () => void;
};

const SupplierOrderEditModal = (props: OrderEditModalProps) => {
	const {
		state,
		close,
		orderEditId,
		supplierOrderEdit,
		currencyCode,
		regionId,
		customerId,
		currentSubtotal,
		paidTotal,
		refetch,
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

	// const showTotals = currentSubtotal !== orderEdit?.items?.subtotal;
	// const hasChanges = !!orderEdit?.changes?.length;

	// const {
	// 	mutateAsync: requestConfirmation,
	// 	isLoading: isRequestingConfirmation,
	// } = useAdminRequestOrderEditConfirmation(orderEdit.id);

	const { mutateAsync: updateOrderEdit, isLoading: isUpdating } =
		useAdminUpdateSupplierOrderEdit(supplierOrderEdit?.id);

	const { mutateAsync: deleteOrderEdit } = useAdminDeleteSupplierOrderEdit(
		supplierOrderEdit?.id
	);

	// const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
	// 	useAdminOrderEditAddLineItem(orderEdit.id);

	const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
		useAdminSupplierOrderUpdateLineItem(orderEditId);

	const onSave = async () => {
		try {
			// await requestConfirmation();
			// if (note) {
			// 	await updateOrderEdit({ internal_note: note });
			// }

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
		// Create the selectedItem array by merging quantities and prices
		// Creating the lineItems array by merging quantities and prices
		const lineItems: UpdateLineItem[] = selectedVariants.map((variantId) => {
			const quantityData = itemQuantities.find(
				(item) => item.variantId === variantId
			);
			const priceData = itemPrices.find((item) => item.variantId === variantId);

			return {
				variantId,
				quantity: quantityData?.quantity || 0, // Default to 0 if not found
				unit_price: priceData?.unit_price || 0, // Default to 0 if not found
			};
		});

		// Building the final UpdateLineItemSupplierOrderReq object
		const supplierOrderReq: UpdateLineItemSupplierOrderReq = {
			cartId: orderEdit?.id,
			lineItems,
		};

		try {
			await addLineItem(supplierOrderReq, {
				onSuccess: () => {
					message.success('Cập nhật danh mục sản phẩm thành công');

					// Refetch the cart to get updated data
					refetch();
				},
				onError: (error) => {
					message.error(getErrorMessage(error));
				},
			});
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

	let displayItems = supplierOrderEdit?.items?.sort(
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
			isLoading={isUpdating}
			disabled={isUpdating}
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
				{/* {displayItems?.map((oi) => (
					<SupplierOrderEditLine
						orderEditId={orderEditId}
						key={oi.id}
						item={oi}
						customerId={customerId}
						regionId={regionId}
						currencyCode={currencyCode}
						refetch={refetch}
					/>
				))} */}
				{/* TOTALS */}
				{/* {showTotals && (
					<TotalsSection currencyCode={currencyCode} amountPaid={paidTotal} />
				)} */}
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
