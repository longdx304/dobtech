import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import { useProductUnit } from '@/lib/providers/product-unit-provider';

type Props = {
	type: 'INBOUND' | 'OUTBOUND';
};

const VariantInventoryForm = ({ type }: Props) => {
	const {
		optionItemUnits,
		defaultUnit,
		selectedUnit,
		quantity,
		setSelectedUnit,
		setQuantity,
	} = useProductUnit();

	const handleUnitChange = (value: string) => {
		setSelectedUnit(value);
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d*$/.test(value)) {
			setQuantity(parseInt(value) || 0);
		}
	};

	return (
		<Flex gap="small" vertical>
			{/* <Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Vị trí nhập:</Text>
				<Input className="w-full" value="Vị trí" disabled />
			</Flex> */}
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Loại hàng:</Text>
				<Select
					className="w-full"
					options={optionItemUnits}
					value={selectedUnit || defaultUnit}
					onChange={handleUnitChange}
				/>
			</Flex>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Số lượng nhập:</Text>
				<Input
					className="w-full"
					placeholder=""
					value={quantity}
					onChange={handleQuantityChange}
				/>
			</Flex>
		</Flex>
	);
};

export default VariantInventoryForm;
