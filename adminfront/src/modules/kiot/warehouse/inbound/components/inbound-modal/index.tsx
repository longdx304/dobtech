import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useGetProductCode } from '@/lib/hooks/api/product-outbound';
import LayeredModal, {
	LayeredModalContext,
} from '@/lib/providers/layer-modal-provider';
import { message } from 'antd';
import clsx from 'clsx';
import { useContext } from 'react';
import WarehouseForm from '../warehouse-form';

type Props = {
	open: boolean;
	onClose: () => void;
	lineItem: any;
	isPermission: boolean;
};

const InboundModal = ({ open, onClose, lineItem, isPermission }: Props) => {
	const layeredModalContext = useContext(LayeredModalContext);
	const { item, isLoading, refetch } = useGetProductCode(lineItem.product_code);

	const handleOk = () => {
		if ((item?.warehouse_quantity ?? 0) > item.quantity) {
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
			<VariantInfo lineItem={item} />
			<WarehouseForm
				sku={item?.product_code}
				lineItem={lineItem}
				isPermission={isPermission}
			/>
		</LayeredModal>
	);
};

export default InboundModal;

const VariantInfo = ({
	lineItem,
}: {
	lineItem: any & { warehouse_quantity: number };
}) => {
	console.log('lineItem VariantInfo', lineItem);

	return (
		<Flex gap={4} vertical className="py-2">
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Tên sản phẩm:</Text>
				<Text className="text-sm font-medium">{`${lineItem?.product_name}`}</Text>
				<Tag
					className="text-sm mt-1"
					color="blue"
				>{`${lineItem?.product_code}`}</Tag>
			</Flex>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">
					Đã nhập kho / Tổng giao:
				</Text>
				<Text
					className={clsx('text-sm font-medium', {
						'text-red-500':
							(lineItem.warehouse_quantity ?? 0) > lineItem.quantity,
					})}
				>{`${lineItem.warehouse_quantity ?? 0} / ${lineItem.quantity}`}</Text>
			</Flex>
		</Flex>
	);
};
