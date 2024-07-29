import { LineItem, Order } from '@medusajs/medusa';
import clsx from 'clsx';
import React, { Fragment, useState, useEffect } from 'react';
import { formatAmountWithSymbol } from '@/utils/prices';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import productsColumns from './products-column';
import { EditableRow, EditableCell } from './products-component';

type RMAReturnProductsTableProps = {
	isAdditionalItems?: boolean
  order: any;
  itemsToAdd: any[];
  handleToAddQuantity: (value: number, itemId: string) => void
  handleRemoveItem: (itemId: string) => void
};

const RMAReturnProductsTable: React.FC<RMAReturnProductsTableProps> = ({
	order,
	isAdditionalItems,
	itemsToAdd,
	handleToAddQuantity = undefined,
	handleRemoveItem = false,
}) => {
	const [dataSource, setDataSource] = useState<
		Omit<LineItem, 'beforeInsert'>[]
	>([]);

	const handleQuantity = (
		change: number,
		item: Omit<LineItem, 'beforeInsert'>
	) => {
		if (
			(item.quantity - item.returned_quantity === toReturn[item.id]?.quantity &&
				change > 0) ||
			(toReturn[item.id]?.quantity === 1 && change < 0)
		) {
			return;
		}

		const newReturns = {
			...toReturn,
			[item.id]: {
				...toReturn[item.id],
				quantity: (toReturn[item.id]?.quantity || 0) + change,
			},
		};
		const newVariants = [...(dataSource as any)];
		const indexVariant = newVariants.findIndex(
			(variant) => item.id === variant.id
		);
		newVariants.splice(indexVariant, 1, {
			...item,
			return_quantity: item.return_quantity + change,
		});
		setDataSource(newVariants as any);

		setToReturn(newReturns);
	};

	// const components = {
	// 	body: {
	// 		row: EditableRow,
	// 		cell: EditableCell,
	// 	},
	// };

	const columns = productsColumns({ order, handleRemoveItem, handleToAddQuantity });

	return (
		<Table
			// components={components}
			// rowClassName={() => 'editable-row'}
			// loading={isLoading}
			columns={columns as any}
			dataSource={itemsToAdd || []}
			rowKey="id"
			pagination={false}
			// scroll={{ x: 700 }}
		/>
	);
};

export default RMAReturnProductsTable;
