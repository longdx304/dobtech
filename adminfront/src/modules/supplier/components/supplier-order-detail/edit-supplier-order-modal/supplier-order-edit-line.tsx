import { ActionAbles } from '@/components/Dropdown';
import { InputNumber } from '@/components/Input';
import { getErrorMessage } from '@/lib/utils';
import PlaceholderImage from '@/modules/common/components/placeholder-image';
import { useAdminSupplierOrderUpdateLineItem } from '@/modules/supplier/hooks';
import {
	useAdminDeleteSOrderEditItemChange,
	useAdminSupplierOrderEditAddLineItem,
	useAdminSupplierOrderEditDeleteLineItem,
	useAdminSupplierOrderEditUpdateLineItem,
} from '@/modules/supplier/hooks/supplier-order-edits';
import { formatAmountWithSymbol } from '@/utils/prices';
import { LineItem, OrderItemChange, ProductVariant } from '@medusajs/medusa';
import { message, Modal } from 'antd';
import clsx from 'clsx';
import { CircleAlert, CopyPlus, Minus, Plus, Trash2 } from 'lucide-react';
import { useAdminOrderEditUpdateLineItem } from 'medusa-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

type SupplierOrderEditLineProps = {
	item: LineItem;
	customerId: string;
	regionId: string;
	currencyCode: string;
	change?: OrderItemChange;
};

let isLoading = false;
const SupplierOrderEditLine = ({
	item,
	currencyCode,
	change,
	customerId,
	regionId,
}: SupplierOrderEditLineProps) => {
	const isNew = change?.type === 'item_add';
	const isModified = change?.type === 'item_update';
	const isLocked = !!item.fulfilled_quantity;

	const [isLoading, setIsLoading] = useState(false);
	const [quantity, setQuantity] = useState(item.quantity);

	const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
		useAdminSupplierOrderEditAddLineItem(item.order_edit_id!);

	const { mutateAsync: removeItem } = useAdminSupplierOrderEditDeleteLineItem(
		item.order_edit_id!,
		item.id
	);

	const { mutateAsync: updateItem } = useAdminSupplierOrderEditUpdateLineItem(
		item.order_edit_id!,
		item.id
	);

	const { mutateAsync: undoChange } = useAdminDeleteSOrderEditItemChange(
		item.order_edit_id!,
		change?.id as string
	);

	const onQuantityUpdate = async (newQuantity: number) => {
		if (isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			await updateItem({ quantity: newQuantity });
			setQuantity(newQuantity);
			message.success('Cập nhật số lượng sản phẩm thành công');
		} catch (error) {
			message.error('Cập nhật thất bại');
			console.error('Error updating quantity:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onDuplicate = async () => {
		if (!item.variant) {
			message.warning('Không thể sao chép một mục mà không có biến thể');
			return;
		}

		try {
			await addLineItem({
				variant_id: item.variant_id as string,
				quantity: item.quantity,
				unit_price: item.unit_price,
			});
		} catch (e) {
			message.error('Không thể sao chép sản phẩm');
		}
	};

	const onRemove = async () => {
		try {
			if (change) {
				if (change.type === 'item_add') {
					await undoChange();
				}
				if (change.type === 'item_update') {
					await undoChange();
					await removeItem();
				}
			} else {
				await removeItem();
			}
			message.success('Sản phẩm đã bị xóa');
		} catch (e) {
			message.error('Không thể xóa sản phẩm');
		}
	};

	const actions = [
		{
			label: <span className="w-full">{'Sao chép mục'}</span>,
			onClick: onDuplicate,
			icon: <CopyPlus size={20} />,
		},
		{
			label: <span className="w-full">{'Xóa mục'}</span>,
			onClick: onRemove,
			variant: 'danger',
			icon: <Trash2 size={20} />,
		},
	].filter(Boolean);

	return (
		<div className="hover:bg-gray-50 rounded-md mx-[-5px] mb-1 flex min-h-[64px] justify-between px-[5px] cursor-pointer">
			<div className="flex justify-center items-center space-x-4">
				<div className="rounded-sm flex h-[48px] w-[36px] overflow-hidden">
					{item.thumbnail ? (
						<Image
							src={item.thumbnail}
							height={48}
							width={36}
							alt={`Image summary ${item.title}`}
							className="object-cover"
						/>
					) : (
						<PlaceholderImage />
					)}
				</div>
				<div className="flex max-w-[185px] flex-col justify-center text-[12px]">
					<div className="flex flex-col-reverse lg:flex-row justify-start items-start lg:items-center lg:gap-2">
						<span className="font-normal text-gray-900 truncate">
							{item.title}
						</span>

						{isNew && (
							<div className="text-xs bg-blue-100 rounded-md mr-2 flex h-[24px] w-[42px] flex-shrink-0 items-center justify-center text-blue-500">
								{'Mới'}
							</div>
						)}

						{isModified && (
							<div className="text-xs bg-orange-100 rounded-md mr-2 flex h-[24px] w-[68px] flex-shrink-0 items-center justify-center text-orange-500">
								{'Đã sửa đổi'}
							</div>
						)}
					</div>
					{item?.variant && (
						<span className="font-normal text-gray-500 truncate">
							{`${item.variant.title}${
								item.variant.sku ? ` (${item.variant.sku})` : ''
							}`}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-center">
				<div className="flex h-full items-center gap-2 sm:gap-6">
					<div className="flex flex-col sm:flex-row gap-2 items-end sm:gap-6">
						<div
							className={clsx('flex flex-grow-0 items-center text-gray-400', {
								'pointer-events-none': isLocked,
							})}
						>
							<InputNumber
								addonBefore={<div>Số lượng</div>}
								placeholder="Thay đổi số lượng"
								size="small"
								className={clsx('cursor-pointer text-gray-400', {
									'pointer-events-none': isLoading,
								})}
								value={quantity}
								onChange={(value) => onQuantityUpdate(Number(value))}
								disabled={isLocked || isLoading}
							/>
						</div>
						<div
							className={clsx('space-x-2 flex text-sm', {
								'pointer-events-none !text-gray-400': isLocked,
							})}
						>
							<div
								className={clsx('min-w-[60px] text-right text-gray-900', {
									'pointer-events-none !text-gray-400': isLocked,
								})}
							>
								{formatAmountWithSymbol({
									amount: item.unit_price * item.quantity,
									currency: currencyCode,
									tax: item.includes_tax ? 0 : item.tax_lines,
								})}
							</div>
						</div>
					</div>
					<ActionAbles actions={actions as any} />
				</div>
			</div>
		</div>
	);
};

export default SupplierOrderEditLine;
