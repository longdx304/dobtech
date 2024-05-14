'use client';
import { FC } from 'react';
import { Product } from '@medusajs/medusa';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Row, Col, Empty, Modal, message, MenuProps } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminUpdateProduct } from 'medusa-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import Image from 'next/image';
import useToggleState from '@/lib/hooks/use-toggle-state';
import ThumbnailModal from './edit-modals/ThumbnailModal';

type Props = {
	product: Product;
	loadingProduct: boolean;
};

const ImageThumbnail: FC<Props> = ({ product, loadingProduct }) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const updateProduct = useAdminUpdateProduct(product?.id);

	const actions = [
		{
			label: <span className="w-full">Chỉnh sửa</span>,
			key: 'edit',
			icon: <Pencil size={20} />,
		},
		{
			label: <span className="w-full">Xoá</span>,
			key: 'delete',
			icon: <Trash2 size={20} />,
			danger: true,
		},
	];

	const handleDeleteThumbnail = () => {
		Modal.confirm({
			title: 'Bạn có muốn xoá thumbnail này không ?',
			content:
				'Thumbnail sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá thumbnail này chứ?',
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
					updateProduct.mutateAsync({ thumbnail: undefined });
					message.success('Xoá thumbnail thành công!');
				} catch (error) {
					message.error('Xoá thumbnail thất bại!');
				}
			},
			confirmLoading: updateProduct.isLoading,
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'edit') {
			onOpen();
			return;
		}
		// Case item is delete
		if (key === 'delete') {
			handleDeleteThumbnail()
			return;
		}
	};

	return (
		<Card loading={loadingProduct} className="max-h-[200px]">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Flex align="center" justify="space-between">
						<Title level={3}>Thumbnail</Title>
						<ActionAbles actions={actions} onMenuClick={handleMenuClick} />
					</Flex>
				</Col>
				<Col span={24}>
					<Flex align="center" justify="center" className="">
						{product?.thumbnail ? (
							<Image
								src={product?.thumbnail}
								alt="Product Thumbnail"
								width={120}
								height={120}
								className="rounded-md hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
							/>
						) : (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
						)}
					</Flex>
				</Col>
			</Row>
			<ThumbnailModal
				state={state}
				handleOk={onClose}
				handleCancel={onClose}
				product={product}
			/>
		</Card>
	);
};

export default ImageThumbnail;
