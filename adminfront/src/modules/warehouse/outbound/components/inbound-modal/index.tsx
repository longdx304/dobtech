import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import LayeredModal, {
	LayeredModalContext,
} from '@/lib/providers/layer-modal-provider';
import { LineItem } from '@medusajs/medusa';
import { useContext } from 'react';
import WarehouseForm from '../warehouse-form';

type Props = {
	open: boolean;
	onClose: () => void;
	variantId: string;
};

const data = {
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
	quantity: 100,
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
};
const warehouse = [
	{
		id: 1,
		location: 'H1.D1.C1',
		quantity: 10,
		unit: {
			id: 1,
			unit: 'Hộp',
			quantity: 2,
		},
	},
	{
		id: 2,
		location: 'H1.D1.C1',
		quantity: 10,
		unit: {
			id: 1,
			unit: 'Hộp',
			quantity: 2,
		},
	},
];
const InboundModal = ({ open, onClose, variantId }: Props) => {
	console.log('variantId:', variantId);
	const layeredModalContext = useContext(LayeredModalContext);

	return (
		<LayeredModal
			context={layeredModalContext}
			onCancel={onClose}
			onOk={onClose}
			open={open}
			// footer={footer}
			title="Thao tác nhập kho"
			className="layered-modal"
			width={800}
		>
			<VariantInfo lineItem={data as any} />
			<WarehouseForm warehouse={warehouse} variantId={variantId} />
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
					lineItem.fulfilled_quantity ?? 0
				} / ${lineItem.quantity}`}</Text>
			</Flex>
		</Flex>
	);
};
