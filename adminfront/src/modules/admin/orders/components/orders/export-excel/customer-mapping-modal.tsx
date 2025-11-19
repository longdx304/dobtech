'use client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { Text } from '@/components/Typography';
import { Order } from '@medusajs/medusa';
import { Radio } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
	CustomerData,
	loadCustomerData,
	paginateCustomers,
	searchCustomers,
} from './customer-data';

interface Props {
	visible: boolean;
	orders: Order[];
	onConfirm: (customerMappings: Record<string, string>) => void;
	onCancel: () => void;
}

const CustomerMappingModal: FC<Props> = ({
	visible,
	orders,
	onConfirm,
	onCancel,
}) => {
	const [allCustomers, setAllCustomers] = useState<CustomerData[]>([]);
	const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
	const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCustomerCode, setSelectedCustomerCode] = useState<string>('');
	const [customerMappings, setCustomerMappings] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);

	const pageSize = 10;

	// Load customer data on mount
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			const customers = await loadCustomerData();
			setAllCustomers(customers);
			setFilteredCustomers(customers);
			setLoading(false);
		};
		if (visible) {
			loadData();
		}
	}, [visible]);

	// Handle search
	useEffect(() => {
		const results = searchCustomers(allCustomers, searchTerm);
		setFilteredCustomers(results);
		setCurrentPage(1);
	}, [searchTerm, allCustomers]);

	const currentOrder = orders[currentOrderIndex];
	const customerName = currentOrder?.customer
		? `${currentOrder.customer.last_name || ''} ${currentOrder.customer.first_name || ''}`.trim()
		: currentOrder?.email || '';

	const paginatedCustomers = paginateCustomers(
		filteredCustomers,
		currentPage,
		pageSize
	);

	const handleSelectCustomer = (code: string) => {
		setSelectedCustomerCode(code);
	};

	const handleNext = () => {
		// Save current selection
		if (selectedCustomerCode) {
			setCustomerMappings(prev => ({
				...prev,
				[currentOrder.id]: selectedCustomerCode,
			}));
		}

		// Move to next order or confirm
		if (currentOrderIndex < orders.length - 1) {
			setCurrentOrderIndex(currentOrderIndex + 1);
			setSearchTerm('');
			setCurrentPage(1);
			// Pre-select if already mapped
			const nextOrder = orders[currentOrderIndex + 1];
			setSelectedCustomerCode(customerMappings[nextOrder.id] || '');
		} else {
			// Last order, confirm all mappings
			const finalMappings = {
				...customerMappings,
				[currentOrder.id]: selectedCustomerCode,
			};
			onConfirm(finalMappings);
		}
	};

	const handlePrevious = () => {
		if (currentOrderIndex > 0) {
			// Save current selection
			if (selectedCustomerCode) {
				setCustomerMappings(prev => ({
					...prev,
					[currentOrder.id]: selectedCustomerCode,
				}));
			}
			setCurrentOrderIndex(currentOrderIndex - 1);
			setSearchTerm('');
			setCurrentPage(1);
			// Load previous selection
			const prevOrder = orders[currentOrderIndex - 1];
			setSelectedCustomerCode(customerMappings[prevOrder.id] || '');
		}
	};

	const handleSkip = () => {
		// Skip without selection (empty code)
		setCustomerMappings(prev => ({
			...prev,
			[currentOrder.id]: '',
		}));

		if (currentOrderIndex < orders.length - 1) {
			setCurrentOrderIndex(currentOrderIndex + 1);
			setSearchTerm('');
			setCurrentPage(1);
			const nextOrder = orders[currentOrderIndex + 1];
			setSelectedCustomerCode(customerMappings[nextOrder.id] || '');
		} else {
			// Last order
			const finalMappings = {
				...customerMappings,
				[currentOrder.id]: '',
			};
			onConfirm(finalMappings);
		}
	};

	const columns = [
		{
			title: 'Chọn',
			dataIndex: 'code',
			key: 'select',
			width: 60,
			render: (code: string) => (
				<Radio
					checked={selectedCustomerCode === code}
					onChange={() => handleSelectCustomer(code)}
				/>
			),
		},
		{
			title: 'Mã khách hàng',
			dataIndex: 'code',
			key: 'code',
			width: 200,
		},
		{
			title: 'Tên khách hàng',
			dataIndex: 'name',
			key: 'name',
		},
	];

	return (
		<Modal
			open={visible}
			title={`Chọn mã khách hàng (${currentOrderIndex + 1}/${orders.length})`}
			handleOk={handleNext}
			handleCancel={onCancel}
			width={800}
			footer={[
				<Button key="cancel" type="default" danger onClick={onCancel}>
					Hủy
				</Button>,
				currentOrderIndex > 0 && (
					<Button key="prev" type="default" onClick={handlePrevious}>
						Quay lại
					</Button>
				),
				<Button key="skip" type="default" onClick={handleSkip}>
					Bỏ qua
				</Button>,
				<Button
					key="next"
					type="primary"
					onClick={handleNext}
					disabled={!selectedCustomerCode}
				>
					{currentOrderIndex < orders.length - 1 ? 'Tiếp theo' : 'Xác nhận'}
				</Button>,
			]}
		>
			<div className="space-y-4">
				<div className="bg-blue-50 p-3 rounded">
					<Text className="font-medium">Đơn hàng số {currentOrder?.display_id}</Text>
					<br />
					<Text className="text-sm">Tên khách hàng: {customerName}</Text>
				</div>

				<Input
					placeholder="Tìm kiếm theo tên hoặc mã khách hàng..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full"
				/>

				<Table
					loading={loading}
					columns={columns}
					dataSource={paginatedCustomers}
					rowKey="code"
					pagination={{
						current: currentPage,
						pageSize: pageSize,
						total: filteredCustomers.length,
						onChange: setCurrentPage,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} của ${total} khách hàng`,
					}}
					onRow={(record) => ({
						onClick: () => handleSelectCustomer(record.code),
						className: 'cursor-pointer',
					})}
					size="small"
				/>
			</div>
		</Modal>
	);
};

export default CustomerMappingModal;

