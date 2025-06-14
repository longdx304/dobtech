import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import { Check, Clock } from 'lucide-react';

type InboundItemProps = {
	item: any;
	handleClickDetail: (id: string | null) => void;
};

const InboundDetailItem: React.FC<InboundItemProps> = ({
	item,
	handleClickDetail,
}) => {
	const isProcessing = item.quantity > (item?.warehouse_quantity ?? 0);

	const handleClick = () => {
		handleClickDetail(item.variant_id);
	};

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Tag
				color={isProcessing ? 'gold' : 'green'}
				className="w-fit flex items-center gap-1 p-2 rounded-lg"
			>
				<span className="text-[14px] font-semibold">
					{isProcessing ? 'Đang tiến hành' : 'Đã hoàn thành'}
				</span>
				{isProcessing ? <Clock size={16} /> : <Check />}
			</Tag>
			<Flex gap={2} vertical className="py-4">
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">Tên sản phẩm:</Text>
					<Text className="text-sm font-medium">{`${item.product_name}`}</Text>
					<Tag className="text-sm mt-1 text-wrap" color="blue">
						<Tooltip
							title={item.product_code}
							color="white"
						>{`${item.product_code}`}</Tooltip>
					</Tag>
				</Flex>
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">Số lượng hàng:</Text>
					<Text className="text-sm font-medium">{`${item.quantity}`}</Text>
				</Flex>
				<Flex vertical align="flex-start">
					<Text className="text-[14px] text-gray-500">
						Số lượng đã nhập vào kho:
					</Text>
					<Text
						className={clsx('text-sm font-medium', {
							'text-red-500': (item.warehouse_quantity ?? 0) < 0,
						})}
					>{`${item.warehouse_quantity ?? 0}`}</Text>
				</Flex>
			</Flex>
			<Button className="w-full" onClick={handleClick}>
				{isProcessing ? 'Thao tác nhập kho' : 'Chỉnh sửa'}
			</Button>
		</Card>
	);
};

export default InboundDetailItem;
