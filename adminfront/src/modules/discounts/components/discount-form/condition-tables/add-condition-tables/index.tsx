import {
	AddConditionSelectorProps,
	DiscountConditionOperator,
} from '@/types/discount';
import { defaultQueryProps } from '../shared/common';
import { useDiscountForm } from '../../discount-form-context';
import { useAdminProducts } from 'medusa-react';
import ConditionOperator from '../shared/condition-operator';
import { useState } from 'react';

const AddProductConditionSelector = ({
	onClose,
}: AddConditionSelectorProps) => {
	const params = defaultQueryProps;
	const { conditions } = useDiscountForm();

	const [operator, setOperator] = useState<DiscountConditionOperator>(
		conditions.products.operator
	);

	const { isLoading, count, products } = useAdminProducts(
		{ ...params },
		{
			keepPreviousData: true,
		}
	);

	return (
		<>
			<ConditionOperator value={operator} onChange={setOperator} />
		</>
	);
};

export default AddProductConditionSelector;
