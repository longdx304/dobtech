'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import AddProductVariant from '@/modules/admin/orders/components/common/add-product-variant';
import { formatAmountWithSymbol } from '@/utils/prices';
import { LineItem } from '@medusajs/medusa';
import { Popconfirm } from '@/components/Popconfirm';
import { InputNumber, message, Popconfirm as AntdPopconfirm } from 'antd';
import clsx from 'clsx';
import { Pencil, Trash2 } from 'lucide-react';
import {
	useAdminDraftOrderAddLineItem,
	useAdminDraftOrderRemoveLineItem,
	useAdminDraftOrderUpdateLineItem,
} from 'medusa-react';
import { useEffect, useState } from 'react';

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
	currencyCode: string;
	removeLineItem: (lineItemId: string) => Promise<any>;
	updateLineItem: (payload: {
		item_id: string;
		quantity?: number;
		unit_price?: number;
	}) => Promise<any>;
};

const DraftOrderEditLine = ({
	item,
	currencyCode,
	removeLineItem,
	updateLineItem,
}: LineProps) => {
	const [savedQuantity, setSavedQuantity] = useState(item.quantity);
	const [draftQuantity, setDraftQuantity] = useState(item.quantity);
	const [unitPrice, setUnitPrice] = useState<number>(item.unit_price);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setSavedQuantity(item.quantity);
		setDraftQuantity(item.quantity);
		setUnitPrice(item.unit_price);
	}, [item.id, item.quantity, item.unit_price]);

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

	const onUnitPriceUpdate = async () => {
		if (saving) return;
		const next = Math.round(unitPrice);
		if (next === item.unit_price) return;

		setSaving(true);
		try {
			await updateLineItem({
				item_id: item.id,
				quantity: savedQuantity,
				unit_price: next,
			});
			setUnitPrice(next);
			message.success('Đã cập nhật giá');
		} catch {
			message.error('Có lỗi khi cập nhật giá');
			setUnitPrice(item.unit_price);
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
			<div className="flex items-center gap-1 text-sm text-gray-600 min-w-[100px] justify-end">
				<Popconfirm
					title="Chỉnh sửa giá"
					description={
						<InputNumber
							className="my-2 w-[130px]"
							min={0}
							value={Math.round(unitPrice)}
							onChange={(v) => setUnitPrice(Number(v ?? 0))}
							disabled={saving}
						/>
					}
					isLoading={saving}
					handleOk={onUnitPriceUpdate}
					handleCancel={() => setUnitPrice(item.unit_price)}
					icon={null}
				>
					<button
						type="button"
						className={clsx('p-0.5 rounded hover:bg-gray-100', {
							'pointer-events-none opacity-50': saving,
						})}
						aria-label="Chỉnh sửa giá"
					>
						<Pencil size={14} />
					</button>
				</Popconfirm>
				<span className="tabular-nums">
					{formatAmountWithSymbol({
						amount: unitPrice,
						currency: currencyCode,
					})}
				</span>
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
			<AntdPopconfirm
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
			</AntdPopconfirm>
		</div>
	);
};
