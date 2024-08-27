'use client';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import Item from '@/modules/cart/components/item';
import Thumbnail from '@/modules/products/components/thumbnail';
import { Cart, Region } from '@medusajs/medusa';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper core styles
import 'swiper/css/bundle';
import 'swiper/css/navigation';

type Props = {
	cart: Omit<Cart, 'refunded_total' | 'refundable_amount'>;
	region?: Region;
};

const ItemsPreview = ({ region, cart }: Props) => {
	const items = cart?.items;

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
						{items?.map((item) => (
							<SwiperSlide key={item.id} className="max-w-[120px] text-[14px]">
								<div className="w-full">
									<Thumbnail
										thumbnail={item?.thumbnail}
										className="aspect-square"
									/>
									<Item
										item={item}
										region={region}
										type="preview"
										cartId={cart?.id}
									/>
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
