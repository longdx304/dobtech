import { ActionAbles } from '@/components/Dropdown';
import { getErrorMessage } from '@/lib/utils';
import PlaceholderImage from '@/modules/common/components/placeholder-image';
import {
	useAdminSupplierOrderEditDeleteLineItem,
	useAdminSupplierOrderUpdateLineItem,
} from '@/modules/supplier/hooks';
import { UpdateLineItemSupplierOrderReq } from '@/types/supplier';
import { formatAmountWithSymbol } from '@/utils/prices';
import { LineItem } from '@medusajs/medusa';
import { message, Modal } from 'antd';
import clsx from 'clsx';
import {
	CircleAlert,
	CopyPlus,
	Minus,
	Plus,
	Trash2
} from 'lucide-react';
import { useAdminOrderEditUpdateLineItem } from 'medusa-react';
import Image from 'next/image';
import { useState } from 'react';

type SupplierOrderEditLineProps = {
	orderEditId: string;
	item: LineItem;
	currencyCode: string;
	refetch: () => void;
};

let isLoading = false;
const SupplierOrderEditLine = ({
	orderEditId,
	item,
	currencyCode,

	refetch,
}: SupplierOrderEditLineProps) => {
	const isNew = item?.metadata?.change === 'item_add';
	// const isModified = change?.type === 'item_update';
	const isLocked = item.quantity === 1;
	const [changeQuantity, setChangeQuantity] = useState<number>(0);

	// const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
	// 	useAdminOrderEditAddLineItem(item.order_edit_id!);

	const { mutateAsync: addLineItem, isLoading: loadingAddLineItem } =
		useAdminSupplierOrderUpdateLineItem(orderEditId);

	// const { mutateAsync: removeItem } = useAdminSupplierOrderEditDeleteLineItem();
	const deleteLineItem = useAdminSupplierOrderEditDeleteLineItem();

	const { mutateAsync: updateItem } = useAdminOrderEditUpdateLineItem(
		item.order_edit_id!,
		item.id
	);


	const onQuantityUpdate = async (newQuantity: number) => {
		console.log('newQuantity', newQuantity);
		
	};

	const onDuplicate = async () => {
		if (!item.variant) {
			message.warning('Không thể sao chép một mục mà không có biến thể');
			return;
		}

		const supplierOrderReq: UpdateLineItemSupplierOrderReq = {
			cartId: item.cart_id,
			lineItems: [
				{
					variantId: item.variant_id as string,
					quantity: item.quantity,
					unit_price: item.unit_price,
				},
			],
			metadata: {
				change: 'item_add',
			},
		};

		try {
			await addLineItem(supplierOrderReq, {
				onSuccess: () => {
					message.success('Sản phẩm được sao chép thành công');
					refetch(); // Ensure cart is refetched
				},
				onError: (error) => {
					message.error(getErrorMessage(error)); // Display detailed error message
				},
			});
		} catch (e) {
			message.error('Không thể sao chép sản phẩm');
		}
	};


	const onRemove = async () => {
		Modal.confirm({
			title: 'Bạn có muốn xoá sản phẩm này?',
			content:
				'Sản phẩm sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá chứ?',
			icon: (
				<CircleAlert
					style={{ width: 32, height: 24 }}
					className="mr-2"
					color="#E7B008"
				/>
			),
			okType: 'danger',
			okText: 'Đồng ý',
			cancelText: 'Huỷ',
			async onOk() {
				deleteLineItem.mutateAsync(
					{
						supplierOrderId: orderEditId,
						lineItemId: item.id,
					},
					{
						onSuccess: () => {
							message.success('Sản phẩm đã bị xóa');
							refetch();
							return;
						},
						onError: () => {
							message.error('Không thể xóa sản phẩm');
							return;
						},
					}
				);
			},
		});
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

						{/* {isModified && (
							<div className="text-xs bg-orange-100 rounded-md mr-2 flex h-[24px] w-[68px] flex-shrink-0 items-center justify-center text-orange-500">
								{'Đã sửa đổi'}
							</div>
						)} */}
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
							<Minus
								className={clsx('cursor-pointer text-gray-400', {
									'pointer-events-none': isLoading,
								})}
								onClick={() =>
									item.quantity > 1 && onQuantityUpdate(item.quantity - 1)
								}
								size={18}
							/>
							<span
								className={clsx(
									'min-w-[20px] px-0 sm:px-2 text-center text-gray-900',
									{
										'!text-gray-400': isLocked,
									}
								)}
							>
								{item.quantity}
							</span>
							<Plus
								className={clsx('cursor-pointer text-gray-400', {
									'pointer-events-none': isLoading,
								})}
								onClick={() => onQuantityUpdate(item.quantity + 1)}
								size={18}
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
