import LayeredModal, {
	LayeredModalContext,
} from '@/lib/providers/layer-modal-provider';
import { Discount, DiscountCondition } from '@medusajs/medusa';
import { useContext } from 'react';
import DetailsProductConditionSelector from './tables/products';
import DetailsCollectionConditionSelector from './tables/collections';
import DetailsTypeConditionSelector from './tables/types';
import DetailsTagConditionSelector from './tables/tags';
import DetailsCustomerGroupConditionSelector from './tables/customer-groups';
import { EditConditionProvider } from './edit-condition/edit-condition-provider';
import ProductConditionsTable from './edit-condition/product';

type Props = {
	open: boolean;
	condition: DiscountCondition;
	discount: Discount;
	onClose: () => void;
};

const EditConditions = ({ open, condition, discount, onClose }: Props) => {
	const context = useContext(LayeredModalContext);

	const renderModalContext = () => {
		switch (condition.type) {
			case 'products':
				return <ProductConditionsTable />;
			// case 'product_collections':
			// 	return <DetailsCollectionConditionSelector onClose={onClose} isEdit />;
			// case 'product_types':
			// 	return <DetailsTypeConditionSelector onClose={onClose} isEdit />;
			// case 'product_tags':
			// 	return <DetailsTagConditionSelector onClose={onClose} isEdit />;
			// case 'customer_groups':
			// 	return (
			// 		<DetailsCustomerGroupConditionSelector onClose={onClose} isEdit />
			// 	);
		}
	};

	return (
		<EditConditionProvider
			condition={condition}
			discount={discount}
			onClose={onClose}
		>
			<LayeredModal
				context={context}
				onCancel={onClose}
				onOk={onClose}
				open={open}
				// footer={footer}
				title="Chỉnh sửa mã giảm giá"
				className="layered-modal"
				width={800}
			>
				{renderModalContext()}
			</LayeredModal>
		</EditConditionProvider>
	);
};

export default EditConditions;
