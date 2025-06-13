import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { useAdminWarehouseTransactionsKiot } from '@/lib/hooks/api/kiot';
import { FC, useState } from 'react';
import transactionColumns from './columns';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	id: string;
}

const PAGE_SIZE = 20;
const ModalTransactionHistory: FC<Props> = ({ isModalOpen, onClose, id }) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const { transactions, isLoading, count } = useAdminWarehouseTransactionsKiot({
		sku: id,
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
	});

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};
	const columns = transactionColumns({});

	return (
		<Modal
			open={isModalOpen}
			handleCancel={() => {
				onClose();
			}}
			handleOk={onClose}
			title={`Lịch sử kho hàng sản phẩm ${id}`}
			isLoading={isLoading}
			width={800}
		>
			<Table
				loading={isLoading}
				columns={columns as any}
				dataSource={transactions}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
					showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total}`,
				}}
			/>
		</Modal>
	);
};

export default ModalTransactionHistory;
