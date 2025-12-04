import { ActionAbles } from '@/components/Dropdown';
import StatusDot from '@/modules/admin/common/components/status-indicator';
import { DraftOrder } from '@medusajs/medusa';
import { MenuProps } from 'antd';
import dayjs from 'dayjs';
import { FolderSync, Trash2 } from 'lucide-react';

type Props = {
	handleTransferToOrder: (id: string) => void;
	handleDeleteDraftOrder: (id: string) => void;
};

const decidePaymentStatus = (status: any) => {
	switch (status) {
		case 'open':
			return <StatusDot variant="default" title={'Đang xử lý'} />;
		case 'completed':
			return <StatusDot variant="success" title={'Hoàn thành bản nháp'} />;
		default:
			return <StatusDot variant="primary" title={'N/A'} />;
	}
};

const draftOrderColumns = ({
	handleTransferToOrder,
	handleDeleteDraftOrder,
}: Props) => [
		{
			title: 'Bản nháp',
			dataIndex: 'display_id',
			key: 'display_id',
			fixed: 'left',
			// width: 150,
			className: 'text-xs',
			render: (_: DraftOrder['display_id']) => {
				return `#${_}`;
			},
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'order',
			key: 'order',
			// width: 150,
			className: 'text-xs',
			render: (_: any, record: DraftOrder) => {
				const items = record.cart?.items || [];
				const total = items.reduce((sum: number, item: any) => {
					return sum + (item.unit_price * item.quantity);
				}, 0);
				return new Intl.NumberFormat('vi-VN', {
					style: 'currency',
					currency: 'VND'
				}).format(total);
			},
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customer',
			key: 'customer',
			// width: 150,
			className: 'text-xs',
			render: (_: any, record: DraftOrder) => {
				const customerEmail = record.cart?.email;
				const customerName = record.cart?.customer?.first_name + ' ' + record.cart?.customer?.last_name;
				return customerName || customerEmail || '-';
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 150,
			className: 'text-xs',
			render: (_: DraftOrder['status']) => {
				return decidePaymentStatus(_);
			},
		},

		{
			title: 'Ngày thêm',
			dataIndex: 'created_at',
			key: 'created_at',
			// width: 150,
			className: 'text-xs',
			render: (_: DraftOrder['created_at']) => {
				return dayjs(_).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Action',
			key: 'action',
			width: 80,
			fixed: 'right',
			className: 'text-xs',
			align: 'center',
			render: (_: any, record: DraftOrder) => {
				const items: MenuProps['items'] = [
					{
						key: 'transfer',
						label: 'Chuyển qua đơn hàng',
						icon: <FolderSync size={20} />,
					},
					{
						key: 'delete',
						label: 'Xoá',
						icon: <Trash2 size={20} />,
						danger: true,
					},
				];

				const handleMenuClick: MenuProps['onClick'] = (e) => {
					e.domEvent.stopPropagation();
					if (e.key === 'transfer') {
						handleTransferToOrder(record.id);
					} else if (e.key === 'delete') {
						handleDeleteDraftOrder(record.id);
					}
				};

				return <ActionAbles actions={items} onMenuClick={handleMenuClick} />;
			},
		},
	];

export default draftOrderColumns;
