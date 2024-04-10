'use client';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';

import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import {Table} from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import productsColumns from './products-column';
import ProductModal from '../products-modal';

interface Props {}

const ProductList = ({}: Props) => {
	const columns = useMemo(() => productsColumns, []);
	const { state, onOpen, onClose } = useToggleState(false);

	return (
		<Card className="w-full">
			<Table columns={columns} dataSource={[]} />
			<FloatButton
				className="absolute"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
			/>
			<ProductModal state={state} handleOk={onClose} handleCancel={onClose} />
		</Card>
	);
};

export default ProductList;
