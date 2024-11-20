import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import { LayeredModalContext } from '@/lib/providers/layer-modal-provider';
import { useContext } from 'react';

type Props = {
	type: 'INBOUND' | 'OUTBOUND';
};

const VariantInventoryForm = ({ type }: Props) => {
	const layeredModalContext = useContext(LayeredModalContext);

	return (
		<Flex gap="small" vertical>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Vị trí nhập:</Text>
				<Input className="w-full" value="Vị trí" disabled />
			</Flex>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Loại hàng:</Text>
				<Select className="w-full" options={[]} />
			</Flex>
			<Flex vertical align="flex-start">
				<Text className="text-[14px] text-gray-500">Số lượng nhập:</Text>
				<Input className="w-full" placeholder="" />
			</Flex>
			<Flex justify="flex-end" gap={6} className="pt-4">
				<Button type="default" onClick={() => layeredModalContext.pop()}>
					Trở lại
				</Button>
				<Button>Nhập hàng</Button>
			</Flex>
		</Flex>
	);
};

export default VariantInventoryForm;
