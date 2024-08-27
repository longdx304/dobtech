'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductBanner = () => {
	const slides = useMemo(() => {
		return [...Array(3)].map((_, index) => (
			<SwiperSlide key={index} className="aspect-[16/9] lg:aspect-[20/9]">
				<div className="relative w-full h-full">
					<Image
						src={`/images/banner/${index + 1}.webp`}
						alt="banner"
						fill
						style={{ objectFit: 'cover' }}
						loading={index === 0 ? 'eager' : 'lazy'}
						priority={index === 0}
					/>
				</div>
			</SwiperSlide>
		));
	}, []);

	return (
		<div>
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				pagination={{
					clickable: true,
				}}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				navigation={true}
				modules={[Autoplay, Pagination, Navigation]}
				className="mainSwiper banner"
			>
				{slides}
			</Swiper>
		</div>
	);
};

export default ProductBanner;
