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

type Props = {
	open: boolean;
	onClose: () => void;
	variantId: string;
	item: LineItem;
};

const InboundModal = ({ open, onClose, variantId, item }: Props) => {
	const layeredModalContext = useContext(LayeredModalContext);
	const { lineItem, isLoading } = useAdminLineItem(item.id);

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
			<VariantInfo lineItem={lineItem} />
			<WarehouseForm variantId={variantId} lineItem={lineItem} />
		</LayeredModal>
	);
};

export default InboundModal;

const VariantInfo = ({ lineItem }: { lineItem: LineItem }) => {
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
				<Text className="text-sm font-medium">{`${
					lineItem.warehouse_quantity ?? 0
				} / ${lineItem.quantity}`}</Text>
			</Flex>
		</Flex>
	);
};