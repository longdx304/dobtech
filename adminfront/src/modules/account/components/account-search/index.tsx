'use client';
import { Search } from 'lucide-react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/Button';

interface Props {}

const AccountSearch = ({}: Props) => {
	return (
		<Card className="w-full space-y-4" bordered={false}>
			<Flex vertical gap="small" className="w-full">
				{/* Title */}
				<Title level={5}>Tìm kiếm nhân viên</Title>
				{/* Search */}
				<Flex gap="small" className="w-full">
					<Input name="search" prefix={<Search />} />
					{/* <SubmitButton className="" data-testid="submitBtn">
						Xác nhận
					</SubmitButton> */}
				</Flex>
				{/* Filter & Sort */}
			</Flex>
		</Card>
	);
};

export default AccountSearch;
