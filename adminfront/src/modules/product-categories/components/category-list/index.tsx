'use client';
import { Plus, CircleAlert, GripVertical, ChevronDown } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { ProductCategory } from '@medusajs/medusa';
import { App } from 'antd';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Nestable from 'react-nestable';
import { dropRight, flatMap, get } from 'lodash';
import { Divider } from 'antd';
import 'react-nestable/dist/styles/index.css';
import '../../styles/product-categories.css';

import { Card } from '@/components/Card';
import { FloatButton } from '@/components/Button';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { TResponse } from '@/types/common';
import { Tooltip } from '@/components/Tooltip';
import CategoryItem from '../category-item';
import CategoryModal from '../category-modal';
import { deleteCategory, updateCategory } from '@/actions/productCategories';

interface Props {
	data: ProductCategory | null;
}

/**
 * Product categories empty state placeholder.
 */
const ProductCategoriesEmptyState = () => {
	return (
		<div className="flex min-h-[600px] items-center justify-center">
			<p className="text-grey-40">
				{
					'Chưa có danh mục sản phẩm nào, hãy sử dụng nút ở trên để tạo danh mục đầu tiên của bạn.'
				}
			</p>
		</div>
	);
};

const CategoryList = ({ data }: Props) => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();
	const currentPage = searchParams.get('page') ?? 1;

	const { message, modal } = App.useApp();
	const { state, onOpen, onClose } = useToggleState(false);
	const [isUpdating, enableUpdating, disableUpdating] = useToggleState(false);
	const [isError, enableError, disableError] = useToggleState(false);
	const [currentCategory, setCurrentCategory] =
		useState<ProductCategory | null>(null);
	const [parentCategory, setParentCategory] = useState<ProductCategory | null>(
		null
	);

	// Handle move item category
	const onItemDrop = useCallback(
		async (params: {
			item: ProductCategory;
			items: ProductCategory[];
			path: number[];
		}) => {
			enableUpdating();
			let parentId = null;
			const { dragItem, items, targetPath } = params;
			const [rank] = targetPath.slice(-1);

			if (targetPath.length > 1) {
				const path = dropRight(
					flatMap(targetPath.slice(0, -1), (item) => [
						item,
						'category_children',
					])
				);

				const newParent = get(items, path);
				parentId = newParent.id;
			}

			try {
				disableError();
				// Update category when drag & drop
				// await client.admin.productCategories.update(dragItem.id, {
				// 	parent_category_id: parentId,
				// 	rank,
				// });
				console.log('dragItem', dragItem.id, parentId, rank);
				await updateCategory(dragItem.id, {
					parent_category_id: parentId,
					rank,
				});
				message.success('Cập nhật danh mục này thành công.');
			} catch (e) {
				message.error('Cập nhật danh mục này thất bại.');
				enableError();
			} finally {
				// await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
				disableUpdating();
			}
		},
		[]
	);

	//Handle create sub category
	const handleCreateSubCategory = (parentCategory: ProductCategory) => {
		setParentCategory(parentCategory);
		onOpen();
	};

	// Handle edit category
	const handleEditCategory = (record: ProductCategory) => {
		setCurrentCategory(record);
		setParentCategory(record);
		onOpen();
	};

	const handleDeleteCategory = async (categoryId: ProductCategory['id']) => {
		modal.confirm({
			title: 'Bạn có muốn xoá danh mục này không ?',
			content:
				'Danh mục sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá danh mục này chứ?',
			icon: (
				<CircleAlert
					style={{ width: 32, height: 24 }}
					className="mr-2"
					color="#E7B008"
				/>
			),
			okType: 'danger',
			okText: 'Đồng ý',
			cancelText: 'Huỷ',
			async onOk() {
				try {
					await deleteCategory(categoryId);
					message.success('Xoá danh mục thành công');
				} catch (error) {
					message.error('Xoá danh mục thất bại');
				}
			},
			onCancel() {},
		});
	};

	// Table Drag & Drop Categories
	const NestableList = useMemo(
		() => (
			<Nestable
				items={data}
				collapsed={true}
				onChange={onItemDrop}
				childrenProp="category_children"
				// Adding an unreasonably high number here to prevent us from
				// setting a hard limit  on category depth. This should be decided upon
				// by consumers of medusa after considering the pros and cons to the approach
				maxDepth={99}
				renderItem={({ item, depth, handler, collapseIcon }) => (
					<CategoryItem
						item={item}
						depth={depth}
						handler={handler}
						collapseIcon={collapseIcon}
						handleCreateSubCategory={handleCreateSubCategory}
						handleEdit={handleEditCategory}
						handleDelete={handleDeleteCategory}
					/>
				)}
				handler={<GripVertical className="cursor-grab" color="#889096" />}
				renderCollapseIcon={({ isCollapsed }) => (
					<ChevronDown
						style={{
							top: -2,
							width: 32,
							left: -12,
							transform: !isCollapsed ? '' : 'rotate(270deg)',
						}}
						color="#889096"
						size={18}
					/>
				)}
			/>
		),
		[data, isError]
	);

	const handleCloseModal = () => {
		setCurrentCategory(null);
		onClose();
	};

	// const handleChangePage = (page: number) => {
	// 	// create new search params with new value
	// 	const newSearchParams = updateSearchQuery(searchParams, {
	// 		page: page,
	// 	});

	// 	// Replace url
	// 	replace(`${pathname}?${newSearchParams}`);
	// };

	return (
		<Card className="w-full px-4 py-2">
			{/* Title */}
			<Title level={4}>Danh mục sản phẩm</Title>
			<FloatButton
				className="top-1/3 max-sm:right-0"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
				data-testid="btnAddCategories"
			/>
			{/* Table categories */}
			<Divider />
			<div
				style={{
					pointerEvents: isUpdating ? 'none' : 'initial',
					position: 'relative',
				}}
			>
				{NestableList}
				{isUpdating && (
					<div
						style={{
							top: 0,
							bottom: 0,
							width: '100%',
							cursor: 'progress',
							position: 'absolute',
						}}
					/>
				)}
			</div>
			<CategoryModal
				stateModal={state}
				handleOk={onClose}
				handleCancel={handleCloseModal}
				category={currentCategory}
				parentCategory={parentCategory}
				categories={data}
			/>
		</Card>
	);
};

export default CategoryList;
