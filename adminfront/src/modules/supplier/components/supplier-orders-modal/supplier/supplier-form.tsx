import { Collapse } from '@/components/Collapse';
import { Flex } from '@/components/Flex';
import { Supplier } from '@/types/supplier';
import { CollapseProps } from 'antd';
import { Minus, Plus } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import General from './general';
import SupplierInfo from './supplier-info';

type SupplierFormProps = {
	suppliers: Supplier[];
	onFinish: (supplier: Supplier) => void;
};

const SupplierForm: FC<SupplierFormProps> = ({ suppliers, onFinish }) => {
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
		null
	);

	const handleSupplierSelect = (supplier: Supplier | null) => {
		setSelectedSupplier(supplier);
		if (supplier) {
			onFinish(supplier);
		}
	};
	const itemsCollapse: CollapseProps['items'] = [
		{
			key: 'info',
			label: (
				<Flex>
					<div className="mr-1">{'Thống tin nhà cung cấp'}</div>
				</Flex>
			),
			children: (
				<SupplierInfo
					suppliers={suppliers}
					selectedSupplier={selectedSupplier}
					setSelectedSupplier={handleSupplierSelect}
				/>
			),
		},
		{
			key: 'general',
			label: (
				<Flex>
					<div className="mr-1">{'Thông tin cơ bản'}</div>
				</Flex>
			),
			children: <General />,
		},
	];

	return (
		<Collapse
			className="bg-white [&_.ant-collapse-header]:px-0 [&_.ant-collapse-header]:text-base [&_.ant-collapse-header]:font-medium"
			defaultActiveKey={['info', 'general']}
			items={itemsCollapse}
			expandIconPosition="end"
			bordered={false}
			expandIcon={ExpandIcon as any}
		/>
	);
};

export default SupplierForm;

const ExpandIcon = ({ isActive }: { isActive: boolean }) =>
	isActive ? <Minus size={20} /> : <Plus size={20} />;
