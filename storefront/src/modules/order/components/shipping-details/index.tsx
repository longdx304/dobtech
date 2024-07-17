import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Order } from '@medusajs/medusa';
import { Divider } from 'antd';

type ShippingDetailsProps = {
	order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
	return (
		<div>
			<Title level={2} className="text-3xl my-4">
				Địa chi giao hàng
			</Title>
			<Flex className="items-start gap-x-8">
				<Flex className="flex-col w-1/3" data-testid="shipping-address-summary">
					<Text className="font-medium text-gray-900 mb-1">
						Địa chi giao hàng
					</Text>
					<Text className="text-gray-600">
						{order.shipping_address.first_name}{' '}
						{order.shipping_address.last_name}
					</Text>
					<Text className="text-gray-600">
						{order.shipping_address.address_1}{' '}
						{order.shipping_address.address_2}
					</Text>
					<Text className="text-gray-600">
						{order.shipping_address.postal_code}, {order.shipping_address.city}
					</Text>
					<Text className="text-gray-600">
						{order.shipping_address.country_code?.toUpperCase()}
					</Text>
				</Flex>

				<Flex className="flex-col w-1/3" data-testid="shipping-contact-summary">
					<Text className="font-medium text-gray-900 mb-1">Liên hệ</Text>
					<Text className="text-gray-600">{order.shipping_address.phone}</Text>
					<Text className="text-gray-600">{order.email}</Text>
				</Flex>

				<Flex className="flex-col w-1/3" data-testid="shipping-method-summary">
					<Text className="font-medium text-gray-900 mb-1">
						Phương thức giao hàng
					</Text>
					<Text className="text-gray-600">
						{order.shipping_methods.length > 0 ? (
							<>
								{order.shipping_methods[0].shipping_option?.name} (
								{formatAmount({
									amount: order.shipping_methods[0].price,
									region: order.region,
									includeTaxes: false,
								})
									.replace(/,/g, '')
									.replace(/\./g, ',')}
								)
							</>
						) : (
							'FakeEx Standard ($8,00)'
						)}
					</Text>
				</Flex>
			</Flex>
			<Divider className="my-4 mx-0" />
		</div>
	);
};

export default ShippingDetails;
