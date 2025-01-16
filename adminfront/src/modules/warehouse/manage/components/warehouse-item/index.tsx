import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Fulfillment, FulfullmentStatus } from '@/types/fulfillments';
import { Warehouse } from '@/types/warehouse';
import clsx from 'clsx';
import { Bike, Check, Clock, Hash, MapPin, Phone, User } from 'lucide-react';

type WarehouseItemProps = {
	item: Warehouse;
	handleClickDetail: (item: Warehouse) => void;
	handleConfirm: (item: Warehouse) => void;
	handleRemoveHandler: (item: Warehouse) => void;
};

const WarehouseItem: React.FC<WarehouseItemProps> = ({
	item,
	handleClickDetail,
	handleConfirm,
	handleRemoveHandler,
}) => {
	const { user } = useUser();

	return (
		<Card className="bg-[#F3F6FF]" rounded>
			<Flex vertical gap={4} className="mt-2">
				1123
			</Flex>
		</Card>
	);
};

export default WarehouseItem;
