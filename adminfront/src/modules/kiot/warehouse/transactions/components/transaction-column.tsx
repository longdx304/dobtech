import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { TransactionType } from '@/types/warehouse';
import { User } from '@medusajs/medusa';
import { DatePicker } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type Props = {};

const typeMap = {
	INBOUND: 'Nhập hàng',
	OUTBOUND: 'Lấy hàng',
};
const { RangePicker } = DatePicker;

const transactionColumns = ({}: Props) => [
	{
		title: 'Sản phẩm',
		dataIndex: 'sku',
		key: 'sku',
		width: 150,
		className: 'text-xs',
		render: (text: string) => {
			return text || '-';
		},
	},
	{
		title: 'Loại hàng',
		dataIndex: 'type',
		key: 'type',
		width: 150,
		className: 'text-xs',
		filters: [
			{ text: 'Nhập hàng', value: 'INBOUND' },
			{ text: 'Lấy hàng', value: 'OUTBOUND' },
		],
		render: (type: TransactionType) => {
			return typeMap[type];
		},
	},
	{
		title: 'Người xử lý',
		dataIndex: 'user',
		key: 'user',
		width: 150,
		className: 'text-xs',
		render: (user: User, record: any) => {
			return (user?.last_name ?? '') + ' ' + user?.first_name;
		},
	},
	{
		title: 'Ghi chú',
		dataIndex: 'note',
		key: 'note',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Ngày tạo',
		dataIndex: 'created_at',
		key: 'created_at',
		width: 180,
		className: 'text-xs',
		sorter: (a: any, b: any) =>
			dayjs.utc(a.created_at).utcOffset(7).valueOf() - dayjs.utc(b.created_at).utcOffset(7).valueOf(),
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			close,
		}: FilterDropdownProps) => {
			return (
				<Flex style={{ padding: 8 }} className="flex-col">
					<RangePicker
						style={{ marginBottom: 8, width: '100%' }}
						onChange={(dates, dateStrings) => {
							setSelectedKeys(dateStrings);
						}}
					/>
					<Flex justify="space-between">
						<Button
							onClick={() => {}}
							style={{ marginRight: 8 }}
							type="default"
						>
							Xóa
						</Button>
						<Button
							onClick={() => {
								confirm({ closeDropdown: true });
								close();
							}}
							type="primary"
						>
							Lọc
						</Button>
					</Flex>
				</Flex>
			);
		},
		render: (createdAt: string) => {
			return dayjs.utc(createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm');
		},
	},
];

export default transactionColumns;
