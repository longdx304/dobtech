import { FC } from "react";

import { User, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Flex, Badge, Input } from "antd";
import { Button, BadgeButton } from "@/components/Button";

interface Props {}

const { Search } = Input;

const HeaderWrap: FC<Props> = ({}) => {
	return (
		<Flex className="w-full" justify="space-between" align="center">
			<div className="flex items-center">
				<Image
					src="/images/dob-icon.png"
					width={28}
					height={37}
					alt="Dob Icon"
				/>
			</div>
			<Flex gap="small" justify="center" align="center">
				<Search
					className="[&_.ant-input-outlined:focus]:shadow-none"
					placeholder="Tìm kiếm"
					onSearch={() => {}}
					enterButton
				/>
				<BadgeButton
					icon={<ShoppingCart className="stroke-2" />}
					count={0}
					showZero
					offset={[0, 10]}
				/>
				<Button
					icon={<User className="stroke-2" />}
					shape="circle"
					type="text"
					onClick={() => {}}
					className=""
				/>
			</Flex>
		</Flex>
	);
};

export default HeaderWrap;
