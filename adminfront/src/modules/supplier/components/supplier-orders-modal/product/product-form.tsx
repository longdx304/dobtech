import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { Product } from '@medusajs/medusa';
import { Col, Row, message } from 'antd';
import _ from 'lodash';
import { Search } from 'lucide-react';
import React, { FC, useMemo, useState } from 'react';
import productColumns from './product-columns';

type ProductFormProps = {
	products: Product[];
	selectedProducts: string[];
	setSelectedProducts: (products: string[]) => void;
	setCurrentStep: (step: number) => void;
	handleCancel: () => void;
};

const PAGE_SIZE = 10;

const ProductForm: FC<ProductFormProps> = ({
	products,
	selectedProducts,
	setSelectedProducts,
	setCurrentStep,
	handleCancel,
}) => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);

	const filteredProducts = useMemo(() => {
		return products.filter((product) =>
			product.title.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [products, searchValue]);

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedProducts(selectedRowKeys as string[]);
	};

	const handleChangeDebounce = _.debounce(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

  const columns = useMemo(
		() => productColumns({}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[products]
	);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const onSubmit = () => {
		if (selectedProducts.length === 0) {
			message.error('Phải chọn ít nhất một sản phẩm');
			return;
		}
		setCurrentStep(1);
	};

	return (
		<Row gutter={[16, 16]} className="pt-4">
			<Col span={24}>
				<Flex
					align="center"
					justify="space-between"
					className="p-4 border-0 border-b border-solid border-gray-200"
				>
					<Title level={4} className="">
						Chọn sản phẩm
					</Title>
					<Input
						placeholder="Nhập tên sản phẩm"
						className="w-[250px] text-xs"
						size="small"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
					/>
				</Flex>
			</Col>
			<Col span={24} id="table-product">
				<Table
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys: selectedProducts,
						onChange: handleRowSelectionChange,
						preserveSelectedRowKeys: true,
					}}
					columns={columns as any}
					dataSource={filteredProducts}
					rowKey="id"
					pagination={{
						total: filteredProducts.length,
						pageSize: PAGE_SIZE,
						current: currentPage,
						onChange: handleChangePage,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} sản phẩm`,
					}}
					scroll={{ x: 700 }}
				/>
			</Col>
			<Col span={24}>
				<Flex justify="flex-end" gap="small" className="mt-4">
					<Button type="default" onClick={handleCancel}>
						Huỷ
					</Button>
					<Button onClick={onSubmit} data-testid="next-step">
						Tiếp tục
					</Button>
				</Flex>
			</Col>
		</Row>
	);
};

export default ProductForm;
