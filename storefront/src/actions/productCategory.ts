import { medusaClient } from "@/lib/database/config";

// Category actions
export async function listCategories() {
	const headers = {
		next: {
			tags: ["categories"],
		},
	} as Record<string, any>;

	return medusaClient.productCategories
		.list(
			{ parent_category_id: "null", include_descendants_tree: true },
			headers
		)
		.then(({ product_categories }) => product_categories)
		.catch((err) => {
			return null;
		});
}
