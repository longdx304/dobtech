import { FC } from "react";
import { useProducts } from "medusa-react";
import { Divider } from "antd";
import { useRouter } from "next/navigation";

import { Flex } from "@/components/Flex";
import { Tag } from "@/components/Tag";
import { Text } from "@/components/Typography";

type Props = {};

const PAGE_SIZE = 10;

const hotSearchs = ["Dép", "Giày"];
const RecentSearch: FC<Props> = ({}) => {
	const router = useRouter();

	const handleClick = (value: string) => {
		router.push(`/search/${value}`);
	};

	return (
		<Flex
			vertical
			align="flex-start"
			justify="center"
			className="px-4 pt-1"
			gap="middle"
		>
			<Flex vertical align="flex-start" justify="center">
				<Text strong>{"Tìm kiếm gần đây"}</Text>
				{/* {products?.length > 0 && (
					<Flex
						vertical
						align="flex-start"
						justify="flex-start"
						className="pt-2 w-full"
					>
						{products?.map((product) => (
							<Flex
								key={product.id}
								vertical
								align="flex-start"
								justify="flex-start"
								className="w-full py-4"
								style={{ borderBottom: "1px solid #d9d9d9" }}
								onClick={() => handleClick(product.title)}
							>
								<Text>{product.title}</Text>
							</Flex>
						))}
					</Flex>
				)} */}
			</Flex>
			<Flex vertical align="flex-start" justify="center">
				<Text strong>{"Tìm kiếm và phát hiện"}</Text>
				<Flex justify="flex-start" align="center" className="pt-2">
					{hotSearchs?.map((hotSearch: string, index: number) => (
						<Tag
							key={index}
							onClick={() => handleClick(hotSearch)}
							className="text-sm px-3 py-2 text-gray-600"
						>
							{hotSearch}
						</Tag>
					))}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default RecentSearch;
