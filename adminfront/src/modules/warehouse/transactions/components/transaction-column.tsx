import dayjs from 'dayjs';

type Props = {};

const transactionColumns = ({}: Props) => [
	{
		title: 'Sản phẩm',
		dataIndex: 'product_name',
		key: 'product_name',
		width: 150,
		className: 'text-xs',
		render: (text: string, record: any) => {
			return record?.variant?.product?.title || '-';
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
		width: 150,
		className: 'text-xs',
		render: (_: any) => {
			return dayjs(_).format('DD/MM/YYYY HH:mm');
		},
	}
];

export default transactionColumns;
