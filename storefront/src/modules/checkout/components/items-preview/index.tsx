'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import Item from '@/modules/cart/components/item';
import Thumbnail from '@/modules/products/components/thumbnail';
import { LineItem, Region } from '@medusajs/medusa';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper core styles
import 'swiper/css';

type Props = {
	items?: Omit<LineItem, 'beforeInsert'>[];
	region?: Region;
};

const ItemsPreview = ({ items, region }: Props) => {
	return (
		<Card>
			<Flex className="flex-col">
				<Text className="text-lg font-semibold mb-4">Chi tiết đơn hàng</Text>

				{items && region ? (
					<Swiper
						className="mySwiper"
						spaceBetween={10}
						slidesPerView={3}
						modules={[Navigation]}
						navigation={true}
					>
						{items.map((item) => (
							<SwiperSlide key={item.id} className="max-w-[120px] text-[14px]">
								<div className="w-full">
									<Thumbnail
										thumbnail={item?.thumbnail}
										className="aspect-square"
									/>
									<Item item={item} region={region} type="preview" />
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				) : (
					<Text className="text-sm">Không có mặt hàng nào trong giỏ hàng.</Text>
				)}
			</Flex>
		</Card>
	);
};

export default ItemsPreview;
