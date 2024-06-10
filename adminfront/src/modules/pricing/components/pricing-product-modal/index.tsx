import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { CircleDollarSign, PackagePlus, Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import _ from 'lodash';
import { useAdminPriceListProducts } from 'medusa-react';
import { Table } from '@/components/Table';
import productsColumns from './products-column';
import { Product } from '@medusajs/medusa';
import { ActionAbles } from '@/components/Dropdown';

type Props = {
	id: string;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

const PAGE_SIZE = 10;
const PriceProductModal: FC<Props> = ({
	id,
	state,
	handleOk,
	handleCancel,
}) => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);

	const { products, isLoading, count } = useAdminPriceListProducts(
		id,
		{
			limit: PAGE_SIZE,
			offset: (currentPage - 1) * PAGE_SIZE,
			q: searchValue || undefined,
			expand: 'variants,collection',
		},
		{
			keepPreviousData: true,
		}
	);

	console.log('products', products);

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const handleEditPricing = (record: Product) => {
		console.log('record', record);
	};

	const handleDeletePricing = (id: Product['id']) => {
		console.log('id', id);
	};

	const actions = [
		{
			label: 'Chỉnh sửa tất cả giá',
			icon: <CircleDollarSign size={20} />,
			onClick: () => {
				// handleEditAllPricing();
			},
		},
		{
			label: 'Thêm sản phẩm',
			icon: <PackagePlus size={20} />,
			onClick: () => {
				// handleDe();
			},
		},
	];

	const columns = useMemo(
		() => productsColumns({ handleEditPricing, handleDeletePricing }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[products]
	);

	return (
		<Modal
			open={state}
			handleOk={handleOk}
			handleCancel={handleCancel}
			width={800}
		>
			<Title level={3}>Danh sách sản phẩm</Title>
			<Flex
				align="center"
				justify="flex-end"
				gap="middle"
				className="p-4 border-0 border-b border-solid border-gray-200"
			>
				<Input
					placeholder="Nhập tên sản phẩm"
					className="w-[250px] text-xs"
					size="small"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
				/>
				<ActionAbles actions={actions as any} />
			</Flex>
			<Table
				columns={columns as any}
				dataSource={products ?? []}
				loading={isLoading}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage || 1,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} sản phẩm`,
				}}
			/>
		</Modal>
	);
};

export default PriceProductModal;
