import { cn } from "@/lib/utils";
import MenuProductDetail from "@/modules/products/templates/menu-product-detail";

export default function ProductDetailLayout(props: {
	children: React.ReactNode;
}) {
	return (
		<div className={cn("w-full box-border")}>
			<MenuProductDetail />
			{props.children}
		</div>
	);
}
