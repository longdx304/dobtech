import { LayeredModalContext } from '@/lib/providers/layer-modal-provider';
import {
	DiscountConditionOperator,
	DiscountConditionType,
} from '@/types/discount';
import { useContext, useMemo } from 'react';
import AddProductConditionSelector from './condition-tables/add-condition-tables';

export type ConditionItem = {
	label: string;
	value: DiscountConditionType;
	description: string;
	onClick: () => void;
};

type UseConditionModalItemsProps = {
	onClose: () => void;
	isDetails?: boolean;
};

export type AddConditionFooterProps = {
	type:
		| 'products'
		| 'product_collections'
		| 'product_types'
		| 'product_tags'
		| 'customer_groups';
	items: { id: string; label: string }[];
	operator: DiscountConditionOperator;
	onClose: () => void;
};

const useConditionModalItems = ({
	isDetails,
	onClose,
}: UseConditionModalItemsProps) => {
	const layeredModalContext = useContext(LayeredModalContext);

	const onConfirm = ({
		type,
		items,
		operator,
		onClose,
	}: AddConditionFooterProps) => {
		console.log(type, items, operator, onClose);
	};

	const items: ConditionItem[] = useMemo(
		() => [
			{
				label: 'Sản phẩm',
				value: DiscountConditionType.PRODUCTS,
				description: 'Chỉ áp dụng cho các sản phẩm cụ thể',
				onClick: () =>
					layeredModalContext.push({
						title: 'Chọn sản phẩm',
						onBack: () => layeredModalContext.pop(),
						footer: null,
						view: isDetails ? (
							// <DetailsProductConditionSelector onClose={onClose} />
							<></>
						) : (
							<AddProductConditionSelector onClose={onClose} />
						),
					}),
			},
			// {
			// 	label: t('discount-form-customer-group', 'Customer group'),
			// 	value: DiscountConditionType.CUSTOMER_GROUPS,
			// 	description: t(
			// 		'discount-form-only-for-specific-customer-groups',
			// 		'Only for specific customer groups'
			// 	),
			// 	onClick: () => {
			// 		layeredModalContext.push({
			// 			title: t('discount-form-choose-groups', 'Choose groups'),
			// 			onBack: () => layeredModalContext.pop(),
			// 			view: isDetails ? (
			// 				<DetailsCustomerGroupConditionSelector onClose={onClose} />
			// 			) : (
			// 				<AddCustomerGroupConditionSelector onClose={onClose} />
			// 			),
			// 		});
			// 	},
			// },
			// {
			// 	label: t('discount-form-tag', 'Tag'),
			// 	value: DiscountConditionType.PRODUCT_TAGS,
			// 	description: t(
			// 		'discount-form-only-for-specific-tags',
			// 		'Only for specific tags'
			// 	),
			// 	onClick: () =>
			// 		layeredModalContext.push({
			// 			title: 'Choose tags',
			// 			onBack: () => layeredModalContext.pop(),
			// 			view: isDetails ? (
			// 				<DetailsTagConditionSelector onClose={onClose} />
			// 			) : (
			// 				<AddTagConditionSelector onClose={onClose} />
			// 			),
			// 		}),
			// },
			// {
			// 	label: t('discount-form-collection', 'Collection'),
			// 	value: DiscountConditionType.PRODUCT_COLLECTIONS,
			// 	description: t(
			// 		'discount-form-only-for-specific-product-collections',
			// 		'Only for specific product collections'
			// 	),
			// 	onClick: () =>
			// 		layeredModalContext.push({
			// 			title: t('discount-form-choose-collections', 'Choose collections'),
			// 			onBack: () => layeredModalContext.pop(),
			// 			view: isDetails ? (
			// 				<DetailsCollectionConditionSelector onClose={onClose} />
			// 			) : (
			// 				<AddCollectionConditionSelector onClose={onClose} />
			// 			),
			// 		}),
			// },
			// {
			// 	label: t('discount-form-type', 'Type'),
			// 	value: DiscountConditionType.PRODUCT_TYPES,
			// 	description: t(
			// 		'discount-form-only-for-specific-product-types',
			// 		'Only for specific product types'
			// 	),
			// 	onClick: () =>
			// 		layeredModalContext.push({
			// 			title: t('discount-form-choose-types', 'Choose types'),
			// 			onBack: () => layeredModalContext.pop(),
			// 			view: isDetails ? (
			// 				<DetailsTypeConditionSelector onClose={onClose} />
			// 			) : (
			// 				<AddTypeConditionSelector onClose={onClose} />
			// 			),
			// 		}),
			// },
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isDetails]
	);

	return items;
};

export default useConditionModalItems;
