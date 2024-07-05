import { Order } from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { Ban } from 'lucide-react';
import StatusIndicator from '@/modules/common/components/status-indicator';
import { Empty, Modal as AntdModal, message } from 'antd';
import dayjs from 'dayjs';
import { useAdminCancelOrder } from 'medusa-react';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/Button';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
};

const Fulfillment = ({ order, isLoading }: Props) => {

	const handleCancelOrder = () => {
	};

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	};

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Thực hiện đơn hàng`}</Title>
					<Button>{'Tạo Fulfillment'}</Button>
				</Flex>
			</div>
		</Card>
	);
};

export default Fulfillment;