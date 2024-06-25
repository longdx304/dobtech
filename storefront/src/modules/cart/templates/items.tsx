import { LineItem, Region } from '@medusajs/medusa';
import { Table, Typography } from 'antd';
import React from 'react';
import Item from '../components/item';
import Thumbnail from '@/modules/products/components/thumbnail';

type ItemsTemplateProps = {
	items?: Omit<LineItem, 'beforeInsert'>[];
	region?: Region;
	selectedItems: Set<string>;
	onItemSelectionChange: (itemId: string, isSelected: boolean) => void;
};

const { Title } = Typography;

const ItemsTemplate = ({
	items,
	region,
	selectedItems,
	onItemSelectionChange,
}: ItemsTemplateProps) => {
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
			selectedRowKeys.forEach((key) => {
				onItemSelectionChange(key as string, true);
			});

			items?.forEach((item) => {
				if (!selectedRowKeys.includes(item.id)) {
					onItemSelectionChange(item.id, false);
				}
			});
		},
		selectedRowKeys: Array.from(selectedItems),
	};

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

	return (
		<div>
			<div className="pb-3 flex items-center">
				<Title level={2} className="text-[2rem] leading-[2.75rem]">
					Tất cả mặt hàng
				</Title>
			</div>
			<Table
				rowSelection={{
					type: 'checkbox',
					...rowSelection,
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
