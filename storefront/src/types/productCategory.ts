export type TTreeCategories = {
	id: string;
	label: string;
	key: string;
	children?: TTreeCategories[];
};
