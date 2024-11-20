'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import List from '@/components/List';
import { Title, Text } from '@/components/Typography';
import { ArrowLeft, Search } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';
import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import InboundItem from '../components/inbound-item';
import debounce from 'lodash/debounce';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import InboundDetailItem from '../components/inbound-detail-item';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';
import useToggleState from '@/lib/hooks/use-toggle-state';
import InboundModal from '../components/inbound-modal';
import { LineItem } from '@medusajs/medusa';

type Props = {
	id: string;
};

const data = {
	id: 'so_01JCMNRC7GZWXVKRZDE3C64T05',
	created_at: '2024-11-14T06:28:43.874Z',
	updated_at: '2024-11-14T06:28:43.874Z',
	display_id: 1,
	supplier_id: 'supplier_01JCMNQHEMC9M93NT2NPBJ8GT6',
	user_id: 'usr_01JBB4EAXMYP7PCYJAKD8T4XQB',
	cart_id: 'cart_01JCMNR8NR3B7XC446PTBG6C96',
	status: 'pending',
	fulfillment_status: 'delivered',
	payment_status: 'awaiting',
	estimated_production_time: '2024-11-21T06:28:40.879Z',
	settlement_time: '2024-11-21T06:28:40.878Z',
	canceled_at: null,
	region_id: 'reg_01JBB4ED399MGK8RKHF09PYHE8',
	currency_code: 'vnd',
	tax_rate: 0,
	metadata: {},
	no_notification: false,
	subtotal: 30000,
	refunded_total: 0,
	paid_total: 33000,
	refundable_amount: 33000,
	tax_total: 0,
	total: 30000,
	items: [
		{
			supplier_order_id: 'so_01JCMNRC7GZWXVKRZDE3C64T05',
			id: 'item_01JCMNR9ADADCYXR64Y99ZHEZD',
			created_at: '2024-11-14T06:28:43.874Z',
			updated_at: '2024-11-14T06:28:43.874Z',
			cart_id: 'cart_01JCMNR8NR3B7XC446PTBG6C96',
			order_id: null,
			swap_id: null,
			claim_order_id: null,
			original_item_id: null,
			order_edit_id: null,
			title: 'Medusa T-Shirt',
			description: 'S / White',
			thumbnail:
				'https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png',
			is_return: false,
			is_giftcard: false,
			should_merge: false,
			allow_discounts: true,
			has_shipping: false,
			unit_price: 10000,
			variant_id: 'variant_01JBB4EGMRPCASXK5FRSGXZMRB',
			quantity: 1,
			fulfilled_quantity: null,
			returned_quantity: null,
			shipped_quantity: null,
			metadata: {},
			adjustments: [],
			tax_lines: [
				{
					id: 'litl_01JCMNRC2VCQNV263DRV9Y53XP',
					created_at: '2024-11-14T06:28:43.874Z',
					updated_at: '2024-11-14T06:28:43.874Z',
					rate: 10,
					name: 'default',
					code: 'default',
					metadata: null,
					item_id: 'item_01JCMNR9ADADCYXR64Y99ZHEZD',
				},
			],
			variant: {
				supplier_price: 0,
				allowed_quantities: 6,
				id: 'variant_01JBB4EGMRPCASXK5FRSGXZMRB',
				created_at: '2024-10-29T03:17:20.990Z',
				updated_at: '2024-10-30T06:18:34.281Z',
				deleted_at: null,
				title: 'S / White',
				product_id: 'prod_01JBB4EFHDHE55H75MZZ8NNXSG',
				sku: null,
				barcode: null,
				ean: null,
				upc: null,
				variant_rank: 1,
				inventory_quantity: 94,
				allow_backorder: false,
				manage_inventory: true,
				hs_code: null,
				origin_country: null,
				mid_code: null,
				material: null,
				weight: null,
				length: null,
				height: null,
				width: null,
				metadata: null,
			},
			subtotal: 10000,
		},
		{
			supplier_order_id: 'so_01JCMNRC7GZWXVKRZDE3C64T05',
			id: 'item_01JCMNR9BX4T3DBF5AY119HR2J',
			created_at: '2024-11-14T06:28:43.874Z',
			updated_at: '2024-11-14T06:28:43.874Z',
			cart_id: 'cart_01JCMNR8NR3B7XC446PTBG6C96',
			order_id: null,
			swap_id: null,
			claim_order_id: null,
			original_item_id: null,
			order_edit_id: null,
			title: 'Medusa T-Shirt',
			description: 'M / Black',
			thumbnail:
				'https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png',
			is_return: false,
			is_giftcard: false,
			should_merge: false,
			allow_discounts: true,
			has_shipping: false,
			unit_price: 20000,
			variant_id: 'variant_01JBB4EH4DWHBR5N8RBK8Y9QC1',
			quantity: 1,
			fulfilled_quantity: null,
			returned_quantity: null,
			shipped_quantity: null,
			metadata: {},
			adjustments: [],
			tax_lines: [
				{
					id: 'litl_01JCMNRC2VPK3ZD99278XHJ4TK',
					created_at: '2024-11-14T06:28:43.874Z',
					updated_at: '2024-11-14T06:28:43.874Z',
					rate: 10,
					name: 'default',
					code: 'default',
					metadata: null,
					item_id: 'item_01JCMNR9BX4T3DBF5AY119HR2J',
				},
			],
			variant: {
				supplier_price: 0,
				allowed_quantities: 6,
				id: 'variant_01JBB4EH4DWHBR5N8RBK8Y9QC1',
				created_at: '2024-10-29T03:17:20.990Z',
				updated_at: '2024-10-29T03:17:20.990Z',
				deleted_at: null,
				title: 'M / Black',
				product_id: 'prod_01JBB4EFHDHE55H75MZZ8NNXSG',
				sku: null,
				barcode: null,
				ean: null,
				upc: null,
				variant_rank: 2,
				inventory_quantity: 100,
				allow_backorder: false,
				manage_inventory: true,
				hs_code: null,
				origin_country: null,
				mid_code: null,
				material: null,
				weight: null,
				length: null,
				height: null,
				width: null,
				metadata: null,
			},
			subtotal: 20000,
		},
	],
};

const DEFAULT_PAGE_SIZE = 10;
const InboundDetail: FC<Props> = ({ id }) => {
	const router = useRouter();
	const { state, onOpen, onClose } = useToggleState();
	const [searchValue, setSearchValue] = useState<string>('');
	const [variantId, setVariantId] = useState<string | null>(null);

	const [activeKey, setActiveKey] = useState<FulfillSupplierOrderStt>(
		FulfillSupplierOrderStt.DELIVERED
	);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangeTab = (key: string) => {
		setActiveKey(key as FulfillSupplierOrderStt);
	};

	const items: TabsProps['items'] = [
		{
			key: FulfillSupplierOrderStt.DELIVERED,
			label: 'Đang chờ nhập kho',
		},
		{
			key: FulfillSupplierOrderStt.INVENTORIED,
			label: 'Đã hoàn thành',
		},
	];

	const handleClickDetail = (id: string | null) => {
		setVariantId(id);
		onOpen();
	};

	const handleClose = () => {
		setVariantId(null);
		onClose();
	};

	const handleChangePage = (page: number) => {
		console.log('page', page);
	};

	const handleBackToList = () => {
		router.push(ERoutes.WAREHOUSE_INBOUND);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Button
					onClick={handleBackToList}
					type="text"
					icon={<ArrowLeft size={18} color="rgb(107 114 128)" />}
					className="text-gray-500 text-sm flex items-center"
				>
					Danh sách đơn hàng
				</Button>
				{/* <Title level={3}>Nhập hàng</Title>
				<Text className="text-gray-600">
					Trang nhập hàng từ Container xuống.
				</Text> */}
			</Flex>
			<Card loading={false} className="w-full mb-10" bordered={false}>
				<Title level={4}>{`Đơn nhập hàng #${1}`}</Title>
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm biến thể sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-full sm:w-[300px]"
					/>
				</Flex>
				<Tabs
					defaultActiveKey={activeKey}
					items={items}
					onChange={handleChangeTab}
					centered
				/>
				<List
					grid={{ gutter: 12, xs: 1, sm: 2, lg: 3 }}
					dataSource={data.items}
					renderItem={(item: LineItem) => (
						<List.Item>
							<InboundDetailItem
								item={item}
								handleClickDetail={handleClickDetail}
							/>
						</List.Item>
					)}
					pagination={{
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
					}}
				/>
				{state && variantId && (
					<InboundModal
						open={state}
						onClose={handleClose}
						variantId={variantId as string}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default InboundDetail;
