'use client';
import { LineItem, Region } from '@medusajs/medusa';
import { Table, Typography } from 'antd';
import React, { useState } from 'react';
import Item from '../components/item';
import Thumbnail from '@/modules/products/components/thumbnail';
import { Checkbox } from '@/components/Checkbox';
import type { CheckboxProps } from 'antd';

type ItemsTemplateProps = {
	items?: Omit<LineItem, 'beforeInsert'>[];
	region?: Region;
	selectedItems: Set<string>;
	setSelectedItems: (rowKey: string) => void;
	onItemSelectionChange: (selectedRowKeys: React.Key[]) => void;
};

const { Title } = Typography;

const ItemsTemplate = ({
	items,
	region,
	selectedItems,
	setSelectedItems,
	onItemSelectionChange,
}: ItemsTemplateProps) => {
	// const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

	const columns = [
		{
			title: 'Thumbnail',
			dataIndex: 'thumbnail',
			key: 'thumbnail',
			className: 'w-[120px]',
			render: (item: any) => (
				<Thumbnail thumbnail={item?.thumbnail} size="square" />
			),
		},
		{
			title: 'Item Details',
			dataIndex: 'item',
			key: 'item',
			render: (item: Omit<LineItem, 'beforeInsert'>) => (
				<Item item={item} region={region!} />
			),
		},
	];

	const dataSource =
		items && region
			? items
					.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
					.map((item) => ({
						key: item.id,
						thumbnail: item,
						item: item,
					}))
			: [];

	const checkAll = dataSource?.length === selectedItems?.length;

	const onChange: CheckboxProps['onChange'] = (e) => {
		const { checked } = e.target;
		if (checked) {
			const selectRowKeysAll = dataSource?.map((item) => item.key);
			setSelectedItems(selectRowKeysAll)
			return;
		}
		setSelectedItems([]);
	};

	// const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
	// 	setSelectedRowKeys(selectedRowKeys);
	// };
	
	return (
		<div>
			<div className="pb-3 flex items-center px-2">
				<Checkbox onChange={onChange} checked={checkAll}>
					<Title level={3} className="leading-[2.75rem] my-0 pl-3">
						{`Tất cả mặt hàng (${dataSource?.length})`}
					</Title>
				</Checkbox>
			</div>
			<Table
				rowSelection={{
					type: 'checkbox',
					selectedRowKeys: selectedItems,
					onChange: onItemSelectionChange,
					preserveSelectedRowKeys: true,
				}}
				columns={columns}
				dataSource={dataSource as any}
				pagination={false}
				showHeader={false}
			/>
		</div>
	);
};

export default ItemsTemplate;
