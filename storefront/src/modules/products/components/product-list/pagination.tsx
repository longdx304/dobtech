'use client';
import { Pagination as AntPagination } from '@/components/Pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface PaginationProps {
	total: number;
	currentPage: number;
	pageSize: number;
}

const Pagination: React.FC<PaginationProps> = ({
	total,
	currentPage,
	pageSize,
}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const handlePageChange = (page: number) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		newSearchParams.set('page', page.toString());
		router.push(`${pathname}?${newSearchParams}`);
	};

	return (
		<AntPagination
			current={currentPage}
			total={total}
			pageSize={pageSize}
			onChange={handlePageChange}
			className="pt-4"
		/>
	);
};

export default Pagination;
