export type DetailFormType = {
	type: {
		value: 'sale' | 'override';
	};
	general: {
		name: string;
		description: string;
		tax_inclusive: boolean;
	};
	dates?: {
		starts_at: string;
		ends_at: string;
	};
	customer_groups?: {
		ids: string[];
	};
};

export type CreatePricingType = {
	detail: DetailFormType;
};

export type CreatePricingList = {
	name: string;
	description: string;
	type: 'sale' | 'override';
	customer_groups?: { id: string }[];
	status?: 'draft' | 'active';
	starts_at?: string;
	ends_at?: string;
	prices?: {
		amount: number;
		variant_id: string;
		currency_code: string;
	}[];
};
