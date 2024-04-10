'use client';
import { Search } from 'lucide-react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/Button';

interface Props {}

const ProductSearch = ({}: Props) => {
	return (
		<Card className="w-full space-y-4" bordered={false}>
			<Flex vertical gap="small" className="w-full">
				{/* Title */}
				<Title level={5}>Tìm kiếm sản phẩm</Title>
				{/* Search */}
				<Flex gap="small" className="w-full">
					<Input
						name="search"
						prefix={<Search />}
						placeholder="Vui lòng nhập tên hoặc mã sản phẩm"
					/>
					<SubmitButton className="mt-1" data-testid="submitBtn">
						Tìm kiếm
					</SubmitButton>
				</Flex>
				{/* Filter & Sort */}
			</Flex>
		</Card>
	);
};

export default ProductSearch;
