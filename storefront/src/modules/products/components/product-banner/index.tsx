"use client"
import React from 'react';
import Image from 'next/image';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductBanner = () => {
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
        className='mainSwiper banner'
      >
        {[...Array(3)].map((_, index) => (
          <SwiperSlide key={index} className='aspect-[16/9] lg:aspect-[20/9]'>
            <div className='relative w-full h-full'>
              <Image
                src={`/images/banner/${index + 1}.jpg`}
                alt='banner'
                fill
                className='w-full h-full object-cover'
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductBanner;
