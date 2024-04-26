import { FC, Fragment } from "react";

import { Pagination } from "@/components/Pagination";
import { Flex } from "@/components/Flex";
import ProductPreview from "@/modules/products/components/product-preview";
import { getProductsList } from "@/actions/products";

interface Props {}

const ProductList: FC<Props> = async ({}) => {
	const { response } = await getProductsList({ pageParam: 0 });
	console.log("data:", response);
	return (
		<Flex vertical gap="middle" justify="center">
			<div className="grid grid-cols-5 w-full gap-x-6 gap-y-6">
				{response?.products?.map((product) => (
					<ProductPreview key={product.id} data={product} />
				))}
			</div>
			<Pagination
				className="flex justify-center"
				showSizeChanger={false}
				defaultCurrent={0}
				total={response?.count ?? 0}
				defaultPageSize={12}
				// showTotal={(total, range) =>
				// 	`${range[0]}-${range[1]} of ${total} items`
				// }
			/>
		</Flex>
	);
};

export default ProductList;
