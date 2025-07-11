import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useAdminLineItem } from '@/lib/hooks/api/line-item';
import LayeredModal, {
	LayeredModalContext,
} from '@/lib/providers/layer-modal-provider';
import { useContext } from 'react';
import WarehouseForm from '../warehouse-form';
import { message } from 'antd';
import { LineItem } from '@/types/lineItem';
import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';

type Props = {
	open: boolean;
	onClose: () => void;
	variantId: string;
	item: LineItem;
	isPermission: boolean;
};

const InboundModal = ({
	open,
	onClose,
	variantId,
	item,
	isPermission,
}: Props) => {
	const layeredModalContext = useContext(LayeredModalContext);
	const { lineItem, isLoading, refetch } = useAdminLineItem(item.id);

	const handleOk = () => {
		if ((lineItem.warehouse_quantity ?? 0) > lineItem.quantity) {
			message.error('Số lượng đã nhập không được lớn hơn số lượng giao');
			return;
		}
		onClose();
	};

	return (
		<LayeredModal
			context={layeredModalContext}
			onCancel={onClose}
			onOk={handleOk}
			open={open}
			title="Thao tác nhập kho"
			className="layered-modal"
			width={800}
			loading={isLoading}
			cancelButtonProps={{ className: 'hidden' }}
			maskClosable={false}
			closable={false}
		>
			<VariantInfo lineItem={lineItem} refetch={refetch} />
			<WarehouseForm
				variantId={variantId}
				lineItem={lineItem}
				isPermission={isPermission}
			/>
		</LayeredModal>
	);
};

export default InboundModal;

const VariantInfo = ({
	lineItem,
	refetch,
}: {
	lineItem: LineItem;
	refetch: () => void;
}) => {
	return (
		<Flex gap={4} vertical className="py-2">
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Tên sản phẩm:</Text>
				<Text className="text-sm font-medium">{`${lineItem.title}`}</Text>
				<Tag
					className="text-sm mt-1"
					color="blue"
				>{`${lineItem.description}`}</Tag>
			</Flex>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">
					Đã nhập kho / Tổng giao:
				</Text>
				<Flex align="center" justify="flex-start" gap={12}>
					<Text
						className={clsx('text-sm font-medium', {
							'text-red-500': (lineItem.warehouse_quantity ?? 0) < 0,
						})}
					>
						{`${lineItem.warehouse_quantity ?? 0} / ${lineItem.quantity}`}
					</Text>
					<RefreshCcw
						size={16}
						onClick={refetch}
						className="text-gray-400 cursor-pointer"
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};
