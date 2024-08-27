import Table from '@/components/Table';
import Thumbnail from '@/modules/products/components/thumbnail';
import { LineItem, Region } from '@medusajs/medusa';
import Item from '../item';

type ItemsProps = {
	items: LineItem[];
	region: Region;
};

const Items = ({ items, region }: ItemsProps) => {
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
		<div className="flex flex-col">
			<Table
				columns={columns}
				dataSource={dataSource as any}
				pagination={false}
				showHeader={false}
			/>
		</div>
	);
};

export default Items;
