import { FC } from "react";
import { ShoppingCart } from "lucide-react";

import { Flex } from "@/components/Flex";
import { Text } from "@/components/Typography";
import { Button } from "@/components/Button";
import { ProductPreviewType } from "@/types/product";

interface Props {
	price: ProductPreviewType["price"];
}

const PreviewPrice: FC<Props> = ({ price }) => {
	return (
		<Flex justify="space-between" align="center" className="">
			<Text className="text-[0.875rem] font-semibold">{`${price?.calculated_price}₫`}</Text>
			<Button
				type="text"
				shape="circle"
				icon={<ShoppingCart className="stroke-2" />}
			/>
		</Flex>
	);
};

export default PreviewPrice;
