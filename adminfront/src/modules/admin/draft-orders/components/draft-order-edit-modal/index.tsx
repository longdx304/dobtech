'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import AddProductVariant from '@/modules/admin/orders/components/common/add-product-variant';
import { formatAmountWithSymbol } from '@/utils/prices';
import { LineItem } from '@medusajs/medusa';
import { InputNumber, message, Popconfirm } from 'antd';
import { Trash2 } from 'lucide-react';
import {
	useAdminDraftOrderAddLineItem,
	useAdminDraftOrderRemoveLineItem,
	useAdminDraftOrderUpdateLineItem,
} from 'medusa-react';
import { useState } from 'react';

type Props = {
	state: boolean;
	onClose: () => void;
	draftOrderId: string;
	cartItems: LineItem[];
	currencyCode: string;
	regionId: string;
	customerId: string;
};

const DraftOrderEditModal = ({
	state,
	onClose,
	draftOrderId,
	cartItems,
	currencyCode,
	regionId,
	customerId,
}: Props) => {
	const {
		state: stateAddProduct,
		onOpen: openAddProduct,
		onClose: closeAddProduct,
	} = useToggleState(false);

	const { mutateAsync: addLineItem, isLoading: isAdding } =
		useAdminDraftOrderAddLineItem(draftOrderId);

	const { mutateAsync: removeLineItem } =
		useAdminDraftOrderRemoveLineItem(draftOrderId);

	const { mutateAsync: updateLineItem } =
		useAdminDraftOrderUpdateLineItem(draftOrderId);

	const onAddVariants = async (selectedVariantIds: string[]) => {
		try {
			await Promise.all(
				selectedVariantIds.map((variantId) =>
					addLineItem({ variant_id: variantId, quantity: 1 })
				)
			);
			message.success('Thêm sản phẩm thành công');
			closeAddProduct();
		} catch {
			message.error('Có lỗi khi thêm sản phẩm');
		}
	};

	return (
		<>
			<Modal open={state} handleOk={onClose} handleCancel={onClose} width={700} footer={null}>
				<Title level={4} className="mb-4">
					Chỉnh sửa đơn nháp
				</Title>

				<Flex justify="flex-end" className="mb-3">
					<Button type="default" onClick={openAddProduct}>
						Thêm sản phẩm
					</Button>
				</Flex>

				<div className="flex flex-col gap-2">
					{cartItems.map((item) => (
						<DraftOrderEditLine
							key={item.id}
							item={item}
							draftOrderId={draftOrderId}
							currencyCode={currencyCode}
							removeLineItem={removeLineItem}
							updateLineItem={updateLineItem}
						/>
					))}
				</div>
			</Modal>

			<AddProductVariant
				title="Thêm sản phẩm vào đơn nháp"
				state={stateAddProduct}
				onClose={closeAddProduct}
				onSubmit={onAddVariants}
				regionId={regionId}
				currencyCode={currencyCode}
				customerId={customerId}
				isLoading={isAdding}
			/>
		</>
	);
};

export default DraftOrderEditModal;

type LineProps = {
	item: LineItem;
	draftOrderId: string;
	currencyCode: string;
	removeLineItem: (lineItemId: string) => Promise<any>;
	updateLineItem: (payload: { item_id: string; quantity: number }) => Promise<any>;
};

const DraftOrderEditLine = ({
	item,
	currencyCode,
	removeLineItem,
	updateLineItem,
}: LineProps) => {
	const [savedQuantity, setSavedQuantity] = useState(item.quantity);
	const [draftQuantity, setDraftQuantity] = useState(item.quantity);
	const [saving, setSaving] = useState(false);

	const onQuantityBlur = async () => {
		if (draftQuantity === savedQuantity || draftQuantity < 1) return;
		setSaving(true);
		try {
			await updateLineItem({ item_id: item.id, quantity: draftQuantity });
			setSavedQuantity(draftQuantity);
			message.success('Đã cập nhật số lượng');
		} catch {
			message.error('Có lỗi khi cập nhật số lượng');
			setDraftQuantity(savedQuantity); // revert on error
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex items-center justify-between border rounded p-2 gap-2">
			<div className="flex-1 text-sm">
				<div className="font-medium line-clamp-1">{item.title}</div>
				{item.variant?.sku && (
					<div className="text-gray-400 text-xs">{item.variant.sku}</div>
				)}
			</div>
			<div className="text-sm text-gray-600 min-w-[80px] text-right">
				{formatAmountWithSymbol({
					amount: item.unit_price,
					currency: currencyCode,
				})}
			</div>
			<InputNumber
				min={1}
				value={draftQuantity}
				size="small"
				disabled={saving}
				className="w-[70px]"
				onBlur={onQuantityBlur}
				onChange={(val) => setDraftQuantity(val ?? savedQuantity)}
			/>
			<Popconfirm
				title="Xóa sản phẩm này?"
				onConfirm={async () => {
					try {
						await removeLineItem(item.id);
						message.success('Đã xóa sản phẩm');
					} catch {
						message.error('Có lỗi khi xóa sản phẩm');
					}
				}}
				okText="Xóa"
				cancelText="Hủy"
			>
				<Button
					type="text"
					icon={<Trash2 size={16} className="text-red-500" />}
					size="small"
				/>
			</Popconfirm>
		</div>
	);
};
