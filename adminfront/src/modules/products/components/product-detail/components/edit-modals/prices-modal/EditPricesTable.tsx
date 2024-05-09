import { FC, useMemo, useState, useEffect } from 'react';
import { Product, Region } from '@medusajs/medusa';

import { Table } from '@/components/Table';
import PricesColumn from './prices-column';
import { EditableRow, EditableCell } from './prices-components';

type Props = {
	product: Product;
	currencies: string[];
	regions: string[];
	onPriceUpdate: (prices: Record<string, number | undefined>) => void;
	storeRegions: Region;
	setIsCancel: (action: boolean) => void;
	isCancel: boolean;
};

const EditPricesTable: FC<Props> = ({
	product,
	currencies,
	regions,
	onPriceUpdate,
	storeRegions,
	isCancel,
	setIsCancel
}) => {
	const [dataSource, setDataSource] = useState(null);

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	useEffect(() => {
		formatProduct();
	}, [product, isCancel]);

	const handleSave = (row: any) => {
		setIsCancel(false);
		const newVariants = [...dataSource];
		const indexVariant = newVariants.findIndex(
			(variant) => row.id === variant.id
		);
		const itemVariant = newVariants[indexVariant];
		newVariants.splice(indexVariant, 1, {
			...itemVariant,
			...row,
		});

		setDataSource(newVariants);
		onPriceUpdate(newVariants);
	};

	const columns = useMemo(() => {
		const pricesColumn = PricesColumn({
			currencies,
			prices: product?.variants ?? [],
			storeRegions,
		});
		const onCellColumn = pricesColumn.map((column) => {
			if (!column?.editable) {
				return column;
			}
			return {
				...column,
				onCell: (record) => ({
					record,
					editable: column.editable,
					dataIndex: column.dataIndex,
					title: column.title,
					handleSave: handleSave,
					storeRegions,
				}),
			};
		});

		return onCellColumn;
	}, [product, currencies, regions, dataSource, isCancel]);

	const formatProduct = () => {
		const { variants } = product || [];
		if (!variants?.length) {
			setDataSource([]);
			return;
		}
		variants.forEach((variant) => {
			variant.pricesFormat = variant.prices.reduce((acc, price) => {
				acc[price.currency_code] = price.amount;
				return acc;
			}, {});
		});
		setDataSource(variants);
		return;
	};

	return (
		<Table
			components={components}
			rowClassName={() => 'editable-row'}
			columns={columns || []}
			dataSource={dataSource ?? []}
			rowKey="id"
			bordered
			pagination={false}
		/>
	);
};

export default EditPricesTable;
