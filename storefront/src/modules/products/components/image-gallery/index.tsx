'use client';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { useProduct } from '@/lib/providers/product/product-provider';
import { useMemo, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

export default function ImageGallery() {
  const { product } = useProduct();

  const images = useMemo(() => {
    if (!product) return null;

    if (!Array.isArray(product.images) || product.images.length === 0) {
      if (!product.thumbnail) {
        return ['/images/product-img.png'];
      }
      return [product.thumbnail];
    }

    return product.images;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const mainSwiperRef = useRef<SwiperCore>();

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

  const handleSlideChange = (swiper: SwiperCore) => {
    setSelectedImage(swiper.activeIndex);
  };

  // const totalImages = Array.isArray(images) ? images.length : 1;

  return (
    <Flex className='flex flex-col-reverse lg:flex-row justify-center items-center gap-4 w-full lg:w-[730px]'>
      {/* Thumbnails */}
      <Flex className='flex flex-wrap lg:flex-col justify-center w-full lg:w-fit gap-4'>
        {images?.map((img, index) => (
          <Flex
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`cursor-pointer w-16 h-16 lg:w-20 lg:h-20 rounded-sm overflow-hidden border border-gray-200 ${
              selectedImage === index ? 'border-primary' : ''
            }`}
            onMouseEnter={() => handleThumbnailClick(index)}
          >
            <Image
              src={typeof img === 'string' ? img : img.url}
              className='object-cover'
              alt={`Thumbnail ${index + 1}`}
              width='inherit'
              height='inherit'
              preview={false}
            />
          </Flex>
        ))}
      </Flex>

      {/* Main Image */}
      <Flex className='flex justify-center w-full lg:w-auto'>
        <Swiper
          onSlideChange={handleSlideChange}
          className='relative w-full sm:w-[400px] h-[350px] sm:h-[400px]'
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
            {images?.map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={typeof img === 'string' ? img : img.url}
                  className='rounded-sm object-contain'
                  alt={`Image ${index + 1}`}
                  width='inherit'
                  height='inherit'
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </Flex>
    </Flex>
  );
}
