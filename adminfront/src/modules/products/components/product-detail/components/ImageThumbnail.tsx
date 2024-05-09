'use client';
import { FC } from 'react';
import { Product } from '@medusajs/medusa';
import { ArrowLeft } from 'lucide-react';
import { Row, Col, Empty } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';

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

const ImageThumbnail: FC = ({ product, loadingProduct }) => {
	const { state, onOpen, onClose } = useToggleState(false);

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

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'edit') {
			onOpen();
			return;
		}
		// Case item is delete
		if (key === 'delete') {
			// handleDeleteProduct(record.id);
			return;
		}
	};

	return (
		<Card loading={loadingProduct}>
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
				thumbnail={product?.thumbnail}
			/>
		</Card>
	);
};

export default ImageThumbnail;
