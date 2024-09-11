import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { Supplier } from '@/types/supplier';
import { ColumnsType } from 'antd/es/table';
import { FC, useState } from 'react';

type SupplierInfoProps = {
	suppliers: Supplier[];
	selectedSupplier: Supplier | null;
	setSelectedSupplier: (supplier: Supplier | null) => void;
};

const SupplierInfo: FC<SupplierInfoProps> = ({
	suppliers,
	selectedSupplier,
	setSelectedSupplier,
}) => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => {
		setIsModalVisible(true);
		setSelectedSupplier(null);
	};

	const columns: ColumnsType<Supplier> = [
		{
			title: 'Tên nhà cung cấp',
			dataIndex: 'supplier_name',
			key: 'supplier_name',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
	];

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(selectedRowKeys);
		const selected = suppliers.find(
			(supplier) => supplier.id === selectedRowKeys[0]
		) as Supplier;
		setSelectedSupplier(selected);
		setIsModalVisible(false);
	};

	return (
		<>
			{/* If no supplier is selected, show the button to select one */}
			{!selectedSupplier ? (
				<Button onClick={openModal}>Chọn nhà cung cấp</Button>
			) : (
				<Card>
					<p>
						<strong>Tên nhà cung cấp:</strong> {selectedSupplier.supplier_name}
					</p>
					<p>
						<strong>Email:</strong> {selectedSupplier.email}
					</p>
					<p>
						<strong>Số điện thoại:</strong> {selectedSupplier.phone}
					</p>
					<p>
						<strong>Địa chi:</strong> {selectedSupplier.address}
					</p>
					{/* Option to change supplier */}
					<Button onClick={openModal}>Đổi nhà cung cấp</Button>
				</Card>
			)}

			{/* Modal for selecting a supplier */}
			<Modal
				open={isModalVisible}
				handleCancel={() => setIsModalVisible(false)}
				handleOk={() => {}}
				title="Chọn nhà cung cấp"
			>
				{/* List of suppliers */}
				<Table
					rowKey="id"
					dataSource={suppliers}
					columns={columns}
					pagination={{ pageSize: 5 }}
					rowSelection={{
						type: 'radio',
						selectedRowKeys: selectedRowKeys,
						onChange: handleRowSelectionChange,
						preserveSelectedRowKeys: true,
					}}
				/>
			</Modal>
		</>
	);
};

export default SupplierInfo;
