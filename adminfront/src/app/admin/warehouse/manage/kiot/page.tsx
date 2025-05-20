import { Flex } from '@/components/Flex';
import { ProductUnitProvider } from '@/lib/providers/product-unit-provider';
import KiotWarehouseManage from '@/modules/warehouse/kiot-manage/templates/warehouse-manage';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Quản lý kho hàng Kiot',
	description: 'Trang quản lý kho hàng Kiot.',
};

interface Props {}

export default async function KiotWarehouseManagePage({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ProductUnitProvider _defaultUnit="đôi">
				<KiotWarehouseManage />
			</ProductUnitProvider>
		</Flex>
	);
}
