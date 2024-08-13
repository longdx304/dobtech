import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';

import {
	AllocationType,
	ConditionMap,
	DiscountConditionOperator,
	DiscountConditionType,
	DiscountFormValues,
	DiscountRuleType,
	UpdateConditionProps,
} from '@/types/discount';
import { Form, FormInstance } from 'antd';
// import { DiscountFormValues } from "./mappers"

type DiscountFormProviderProps = {
	children?: React.ReactNode;
};

const defaultConditions: ConditionMap = {
	products: {
		id: undefined,
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCTS,
		items: [],
	},
	product_collections: {
		id: undefined,
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCT_COLLECTIONS,
		items: [],
	},
	product_tags: {
		id: undefined,
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCT_TAGS,
		items: [],
	},
	product_types: {
		id: undefined,
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCT_TYPES,
		items: [],
	},
	customer_groups: {
		id: undefined,
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.CUSTOMER_GROUPS,
		items: [],
	},
};

type DiscountFormContextType = {
	form: FormInstance<DiscountFormValues>;
	type?: string;
	isDynamic: boolean;
};
const defaultDiscountContext: DiscountFormContextType = {
	form: {} as FormInstance<DiscountFormValues>,
	type: undefined,
	isDynamic: false,
};
const DiscountFormContext = React.createContext(defaultDiscountContext);

export const DiscountFormProvider = ({
	children,
}: DiscountFormProviderProps) => {
	const [form] = Form.useForm();

	const type = Form.useWatch(['rule', 'type'], form) || undefined;
	const isDynamic = Form.useWatch('is_dynamic', form) || undefined;
	// const usageLimit = Form.useWatch('usage_limit', form) || undefined;
	// const validDuration = Form.useWatch('valid_duration', form) || undefined;
	// const endsAt = Form.useWatch('ends_at', form) || undefined;
	// const startsAt = Form.useWatch('starts_at', form) || undefined;

	// form.setFieldsValue({
	// 	rule: {
	// 		type: DiscountRuleType.PERCENTAGE,
	// 		allocation: AllocationType.TOTAL,
	// 	},
	// });

	const value = {
		form,
		type,
		isDynamic,
	};
	return (
		<DiscountFormContext.Provider value={value}>
			{children}
		</DiscountFormContext.Provider>
	);
};

export const useDiscountForm = () => {
	const context = React.useContext(DiscountFormContext);
	if (context === undefined) {
		throw new Error(
			'useDiscountForm must be used within a DiscountFormProvider'
		);
	}
	return context;
};
