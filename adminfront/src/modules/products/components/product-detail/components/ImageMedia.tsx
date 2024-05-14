'use client';
import { FC } from 'react';
import { Product } from '@medusajs/medusa';
import { Row, Col, Empty, MenuProps } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { ActionAbles } from '@/components/Dropdown';
import Image from 'next/image';
import MediaModal from './edit-modals/MediaModal';
import useToggleState from '@/lib/hooks/use-toggle-state';

type Props = {
	product: Product;
	loadingProduct: boolean;
};

const ImageMedia: FC<Props> = ({ product, loadingProduct }) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const actions = [
		{
			label: <span className="w-full">Chỉnh sửa</span>,
			key: 'edit',
			icon: <Pencil size={20} />,
		},
	];

	const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'edit') {
			onOpen();
			return;
		}
	};

	return (
		<Card loading={loadingProduct} className='max-h-[200px]'>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Flex align='center' justify='space-between'>
						<Title level={3}>Media</Title>
						<ActionAbles actions={actions} onMenuClick={handleMenuClick} />
					</Flex>
				</Col>
				<Col span={24}>
					<Flex align='center' justify='center' gap='small' className=''>
						{product?.images?.length ? product?.images?.map((image) => (
							<div key={image.id} className="flex aspect-square items-center justify-center">
								<Image
									src={image?.url}
									alt={`Product Image ${image.id}`}
									width={120}
									height={120}
									className="rounded-md rounded-md hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
								/>
							</div>
						)) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
					</Flex>
				</Col>
			</Row>
			<MediaModal state={state} handleOk={onClose} handleCancel={onClose} product={product} />
		</Card>
	);
};

export default ImageMedia;
