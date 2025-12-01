import { Flex } from '@/components/Flex';
import Tooltip from '@/components/Tooltip/Tooltip';
import { Text } from '@/components/Typography';
import { formatAmountWithSymbol } from '@/utils/prices';
import { ProductVariant } from '@medusajs/medusa';
import { InputNumber, Popover, Radio, RadioChangeEvent, Space } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
	currency: string | undefined;
	getQuantity: (variantId: string) => number;
	handleQuantityChange: (value: number, variantId: string) => void;
	getPrice: (variantId: string) => number;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
}

type SelectProduct = Omit<
	ProductVariant & { quantity?: number; unit_price?: number },
	'beforeInsert'
>;

enum Unit {
	Đôi = 'đôi',
	Giỏ = 'giỏ',
	Bịch6 = 'bịch6',
	Bịch12 = 'bịch12',
	Thùng = 'thùng',
	Bao60 = 'bao60',
	Bao120 = 'bao120',
	Bao240 = 'bao240',
}

// Helper functions for unit conversion
const convertToDoi = (value: number, fromUnit: Unit): number => {
	switch (fromUnit) {
		case Unit.Đôi:
			return value;
		case Unit.Giỏ:
			return value * 24;
		case Unit.Bịch6:
			return value * 6;
		case Unit.Bịch12:
			return value * 12;
		case Unit.Thùng:
			return value * 6;
		case Unit.Bao60:
			return value * 60;
		case Unit.Bao120:
			return value * 120;
		case Unit.Bao240:
			return value * 240;
		default:
			return value;
	}
};

const convertFromDoi = (valueInDoi: number, toUnit: Unit): number => {
	switch (toUnit) {
		case Unit.Đôi:
			return valueInDoi;
		case Unit.Giỏ:
			return Math.floor(valueInDoi / 24);
		case Unit.Bịch6:
			return Math.floor(valueInDoi / 6);
		case Unit.Bịch12:
			return Math.floor(valueInDoi / 12);
		case Unit.Thùng:
			return Math.floor(valueInDoi / 6);
		case Unit.Bao60:
			return Math.floor(valueInDoi / 60);
		case Unit.Bao120:
			return Math.floor(valueInDoi / 120);
		case Unit.Bao240:
			return Math.floor(valueInDoi / 240);
		default:
			return valueInDoi;
	}
};

const getUnitMultiplier = (unit: Unit): number => {
	switch (unit) {
		case Unit.Đôi:
			return 1;
		case Unit.Giỏ:
			return 24;
		case Unit.Bịch6:
			return 6;
		case Unit.Bịch12:
			return 12;
		case Unit.Thùng:
			return 6;
		case Unit.Bao60:
			return 60;
		case Unit.Bao120:
			return 120;
		case Unit.Bao240:
			return 240;
		default:
			return 1;
	}
};

const EditableQuantity = ({
	quantity,
	record,
	handleQuantityChange,
}: {
	quantity: number;
	record: SelectProduct;
	handleQuantityChange: (value: number, variantId: string) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<Unit>(Unit.Đôi);
	const [inputValue, setInputValue] = useState<number>(quantity || 1);

	// Convert quantity to appropriate unit when unit changes
	const handleUnitChange = (e: RadioChangeEvent) => {
		const newUnit = e.target.value as Unit;
		setSelectedUnit(newUnit);

		// Convert current inputValue from đôi to new unit
		const currentQuantityInDoi = convertToDoi(inputValue, selectedUnit);
		setInputValue(convertFromDoi(currentQuantityInDoi, newUnit));
	};

	const handleValueChange = (value: number | null) => {
		if (value !== null) {
			const unitMultiplier = getUnitMultiplier(selectedUnit);
			const maxInCurrentUnit = !record.allow_backorder
				? Math.floor(record.inventory_quantity / unitMultiplier)
				: Number.MAX_SAFE_INTEGER;

			const finalInputValue = Math.min(value, maxInCurrentUnit);
			setInputValue(finalInputValue);

			// Convert to đôi before sending to parent
			const finalQuantity = convertToDoi(finalInputValue, selectedUnit);
			handleQuantityChange(finalQuantity, record?.id as string);
		}
	};

	// Update inputValue when quantity prop changes
	useEffect(() => {
		const newValue = quantity || 1;
		setInputValue(convertFromDoi(newValue, selectedUnit));
	}, [quantity, selectedUnit]);

	const popoverContent = (
		<Space direction="vertical" className="w-full">
			<Radio.Group value={selectedUnit} onChange={handleUnitChange}>
				<Space direction="vertical">
					<Radio value={Unit.Đôi}>Đôi</Radio>
					<Radio value={Unit.Giỏ}>Giỏ (1 giỏ = 24 đôi)</Radio>
					<Radio value={Unit.Bịch6}>Bịch 6 (1 bịch = 6 đôi)</Radio>
					<Radio value={Unit.Bịch12}>Bịch 12 (1 bịch = 12 đôi)</Radio>
					<Radio value={Unit.Thùng}>Thùng (1 thùng = 6 đôi)</Radio>
					<Radio value={Unit.Bao60}>Bao 60 (1 bao = 60 đôi)</Radio>
					<Radio value={Unit.Bao120}>Bao 120 (1 bao = 120 đôi)</Radio>
					<Radio value={Unit.Bao240}>Bao 240 (1 bao = 240 đôi)</Radio>
				</Space>
			</Radio.Group>
			<InputNumber
				autoFocus
				min={1}
				max={
					!record.allow_backorder
						? Math.floor(record.inventory_quantity / getUnitMultiplier(selectedUnit))
						: Number.MAX_SAFE_INTEGER
				}
				value={inputValue}
				onChange={handleValueChange}
				onBlur={() => setIsEditing(false)}
				onPressEnter={() => setIsEditing(false)}
				className="w-full"
			/>
		</Space>
	);

	return (
		<Popover
			content={popoverContent}
			trigger="click"
			open={isEditing}
			onOpenChange={setIsEditing}
		>
			<Text className="text-right text-gray-500 cursor-pointer">
				{quantity || 1}
			</Text>
		</Popover>
	);
};

const EditablePrice = ({
	unitPrice,
	record,
	handlePriceChange,
	currency,
}: {
	currency: string | undefined;
	unitPrice: number;
	record: SelectProduct;
	handlePriceChange: (
		variantId: string,
		value: number,
		currency: string
	) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);

	return isEditing ? (
		<InputNumber
			autoFocus
			min={1}
			defaultValue={unitPrice || 1}
			onBlur={() => setIsEditing(false)}
			onPressEnter={() => setIsEditing(false)}
			onChange={(value) => {
				if (value !== null) {
					handlePriceChange(record?.id, +value, currency || 'vnd');
				}
			}}
			className="w-20"
		/>
	) : (
		<Text
			className="text-right text-gray-500 cursor-pointer"
			onClick={() => setIsEditing(true)}
		>
			{formatAmountWithSymbol({
				amount: unitPrice,
				currency: currency || 'vnd',
			})}
		</Text>
	);
};

const productsColumns = ({
	currency,
	getQuantity,
	handleQuantityChange,
	getPrice,
	handlePriceChange,
}: Props) => {
	return [
		{
			title: 'Tên sản phẩm',
			key: 'product',
			dataIndex: 'product',
			className: 'text-xs',
			fixed: 'left',
			render: (_: any, record: ProductVariant) => {
				const variantImages = _?.metadata?.variant_images
					? JSON.parse(_?.metadata?.variant_images)
					: [];

				const variantImage = variantImages.find(
					(image: any) => image.variant_value === record.title
				);

				const thumbnail = variantImage?.image_url
					? variantImage?.image_url
					: _?.thumbnail ?? '/images/product-img.png';

				return (
					<Flex className="flex items-center gap-3">
						<Image
							src={thumbnail}
							alt="Product variant Thumbnail"
							width={30}
							height={40}
							className="rounded-md cursor-pointer"
						/>
						<Flex vertical className="">
							<Tooltip title={_?.title ?? ''}>
								<Text className="text-xs line-clamp-2">{_?.title ?? ''}</Text>
							</Tooltip>
							<span className="text-gray-500">{record?.title ?? ''}</span>
						</Flex>
					</Flex>
				);
			},
		},
		{
			title: 'Số lượng',
			key: 'quantity',
			dataIndex: 'quantity',
			className: 'text-xs',
			width: 100,

			render: (_: any, record: SelectProduct) => {
				return (
					<EditableQuantity
						quantity={getQuantity(record?.id as string)}
						record={record}
						handleQuantityChange={handleQuantityChange}
					/>
				);
			},
		},
		{
			title: 'Giá tiền',
			key: 'unit_price',
			dataIndex: 'unit_price',
			className: 'text-xs text-center',
			render: (_: any, record: SelectProduct) => {
				return (
					<EditablePrice
						unitPrice={getPrice(record?.id as string)}
						record={record}
						handlePriceChange={handlePriceChange}
						currency={currency}
					/>
				);
			},
		},
		{
			title: 'Còn hàng',
			key: 'inventory_quantity',
			dataIndex: 'inventory_quantity',
			className: 'text-xs',
			render: (
				_: ProductVariant['inventory_quantity'],
				record: ProductVariant
			) => {
				return _;
			},
		},
	];
};

export default productsColumns;
