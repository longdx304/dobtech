import { Order } from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import { Contact, RefreshCw, Truck, CircleDollarSign, Mail } from 'lucide-react';
import StatusIndicator from '@/modules/common/components/status-indicator';
import { Empty, Modal as AntdModal, message } from 'antd';
import dayjs from 'dayjs';
import { getErrorMessage } from '@/lib/utils';

type Props = {
	order: Order | undefined;
	isLoading: boolean;
};

const CustomerInfo = ({ order, isLoading }: Props) => {

	const handleCancelOrder = () => {
	};

	const actions = [
		{
			label: <span className="w-full">{'Chuyển đến khách hàng'}</span>,
			key: 'move-in',
			icon: <Contact />,
		},
		{
			label: <span className="w-full">{'Chuyển quyền sở hữu'}</span>,
			key: 'swap',
			icon: <RefreshCw />,
		},
		{
			label: <span className="w-full">{'Chỉnh sửa địa chỉ giao hàng'}</span>,
			key: 'edit-address',
			icon: <Truck />,
		},
		{
			label: <span className="w-full">{'Chỉnh sửa địa chỉ thanh toán'}</span>,
			key: 'edit-payment-address',
			icon: <CircleDollarSign />,
		},
		{
			label: <span className="w-full">{'Chỉnh sửa địa chỉ email'}</span>,
			key: 'edit-email',
			icon: <Mail />,
		},
	];

	return (
		<Card loading={isLoading} className="px-4">
			{!order && <Empty description="Không tìm thấy đơn hàng" />}
			{order && (
				<div className="">
					<Flex align="center" justify="space-between" className="pb-2">
						<Title level={4}>{`Khách hàng`}</Title>
						<div className="flex justify-end items-center gap-4">
							<ActionAbles actions={actions} />
						</div>
					</Flex>
					<Flex vertical gap={4} className="pt-8">
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Email:</Text>
							<Text className="text-gray-500 text-sm">{order.email}</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Liên hệ:</Text>
							<Text className="text-gray-500 text-sm">{order?.shipping_address?.phone ??
									order?.customer?.phone ??
									'-'}</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Vận chuyển:</Text>
							<Text className="text-gray-500 text-sm">
								<div className="font-normal flex flex-col items-end">
									<span>
										{order.shipping_address?.address_1} {order.shipping_address?.address_2}
									</span>
									<span>
										{order.shipping_address?.postal_code} {order.shipping_address?.city}
										{", "}
										{order.shipping_address?.province ? `${order.shipping_address.province} ` : ""}
										{order.shipping_address?.country_code?.toUpperCase()}
									</span>
								</div>
							</Text>
						</Flex>
						<Flex justify="space-between" align="center">
							<Text className="text-gray-500 text-sm">Thanh toán:</Text>
							<Text className="text-gray-500 text-sm">
								<div className="font-normal flex flex-col items-end">
									<span>
										{order.billing_address?.address_1} {order.billing_address?.address_2}
									</span>
									<span>
										{order.billing_address?.postal_code} {order.billing_address?.city}
										{", "}
										{order.billing_address?.province ? `${order.billing_address.province} ` : ""}
										{order.billing_address?.country_code?.toUpperCase()}
									</span>
								</div>
							</Text>
						</Flex>
					</Flex>
				</div>
			)}
		</Card>
	);
};

export default CustomerInfo;