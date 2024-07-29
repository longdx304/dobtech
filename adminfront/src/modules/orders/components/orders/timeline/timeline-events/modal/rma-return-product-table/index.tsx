import { LineItem, Order } from '@medusajs/medusa';
import clsx from 'clsx';
import React, { Fragment, useState, useEffect } from 'react';
import { formatAmountWithSymbol } from '@/utils/prices';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import productsColumns from './products-column';
import { EditableRow, EditableCell } from './products-component';

type RMAReturnProductsTableProps = {
	isAdditionalItems?: boolean;
	order: any;
	itemsToAdd: any[];
	handleToAddQuantity: (value: number, itemId: string) => void;
	handleRemoveItem: (itemId: string) => void;
};

const RMAReturnProductsTable: React.FC<RMAReturnProductsTableProps> = ({
	order,
	isAdditionalItems,
	itemsToAdd,
	handleToAddQuantity = undefined,
	handleRemoveItem = false,
}) => {
	const columns = productsColumns({
		order,
		handleRemoveItem,
		handleToAddQuantity,
	} as any);

	return (
		<Table
			columns={columns as any}
			dataSource={itemsToAdd || []}
			rowKey="id"
			pagination={false}
		/>
	);
};

export default RMAReturnProductsTable;
