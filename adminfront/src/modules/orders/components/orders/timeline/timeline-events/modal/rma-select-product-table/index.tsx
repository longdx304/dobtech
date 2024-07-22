import { LineItem, Order } from '@medusajs/medusa';
import clsx from 'clsx';
import React, { Fragment, useState, useEffect } from 'react';
import { formatAmountWithSymbol } from '@/utils/prices';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import productsColumns from './products-column';
import { EditableRow, EditableCell } from './products-component';

type RMASelectProductTableProps = {
	order: Omit<Order, 'beforeInsert'>;
	allItems: Omit<LineItem, 'beforeInsert'>[];
	toReturn: any;
	setToReturn: (items: any) => void;
	customReturnOptions?: any[];
	imagesOnReturns?: any;
	isSwapOrClaim?: boolean;
};

const RMASelectProductTable: React.FC<RMASelectProductTableProps> = ({
	order,
	allItems,
	toReturn,
	customReturnOptions = undefined,
	imagesOnReturns = false,
	setToReturn,
	isSwapOrClaim = false,
}) => {
	const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
	const [dataSource, setDataSource] = useState<
		Omit<LineItem, 'beforeInsert'>[]
	>([]);

	useEffect(() => {
		setDataSource(
			allItems.map((item) => ({
				...item,
				return_quantity: item.quantity - item.returned_quantity,
			}))
		);
	}, [allItems]);

	const handleReturnToggle = (
		record: Omit<LineItem, 'beforeInsert'>,
		selected: boolean
	) => {
		const newReturns = { ...toReturn };
		if (selected) {
			newReturns[record.id] = {
				images: null,
				reason: null,
				note: '',
				quantity: record.quantity - record.returned_quantity,
			};
		} else {
			delete newReturns[record.id];
			setDataSource(
				allItems.map((item) => ({
					...item,
					return_quantity: item.quantity - item.returned_quantity,
				}))
			);
		}

		setToReturn(newReturns);
	};

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedVariants(selectedRowKeys as string[]);
	};

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
		// const itemVariant = newVariants[indexVariant];
		newVariants.splice(indexVariant, 1, {
			...item,
			return_quantity: item.return_quantity + change,
		});
		setDataSource(newVariants as any);
		console.log('newReturns', newVariants[item.id]);

		setToReturn(newReturns);
	};

	// const setReturnReason = (reason, note, files, id) => {
	//   let newReturns = {}
	//   if (imagesOnReturns && files?.length) {
	//     handleAddImages(files).then((res) => {
	//       newReturns = {
	//         ...toReturn,
	//         [id]: {
	//           ...toReturn[id],
	//           reason: reason,
	//           note: note,
	//           images: [...(toReturn[id].images || []), ...res],
	//         },
	//       }
	//       setToReturn(newReturns)
	//     })
	//   } else {
	//     newReturns = {
	//       ...toReturn,
	//       [id]: {
	//         ...toReturn[id],
	//         reason: reason,
	//         note: note,
	//       },
	//     }

	//     setToReturn(newReturns)
	//   }
	// }

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const columns = productsColumns({ currencyCode: order.currency_code }).map(
		(col) => {
			if (!col?.editable) {
				return col;
			}
			return {
				...col,
				onCell: (record: any) => ({
					record,
					editable: selectedVariants.includes(record.id),
					dataIndex: col.dataIndex,
					title: col.title,
					handleQuantity,
					// handleSave: handleSave,
				}),
			};
		}
	);

	return (
		<Table
			components={components}
			rowClassName={() => 'editable-row'}
			rowSelection={{
				type: 'checkbox',
				selectedRowKeys: selectedVariants,
				onChange: handleRowSelectionChange,
				preserveSelectedRowKeys: true,
				onSelect: handleReturnToggle,
				// getCheckboxProps: (record) => ({
				// 	disabled: productIds?.includes(record.id),
				// }),
			}}
			// loading={isLoading}
			columns={columns as any}
			dataSource={dataSource || []}
			rowKey="id"
			pagination={false}
			// scroll={{ x: 700 }}
		/>
	);
};

export default RMASelectProductTable;
