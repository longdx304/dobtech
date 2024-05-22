'use client';

import { Flex } from '@/components/Flex';
import { Image as MedusaImage } from '@medusajs/medusa';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

type ImageGalleryProps = {
  images: MedusaImage[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
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

  return (
    <Flex className='flex flex-col-reverse lg:flex-row justify-center items-center gap-4 w-full lg:w-[730px]'>
      <Swiper
        direction={'horizontal'}
        breakpoints={{
          1024: {
            direction: 'vertical',
          },
        }}
        slidesPerView={'auto'}
        spaceBetween={10}
        className='mySwiper img-thumbnail z-[1] w-full lg:w-auto overflow-y-visible gap-2 lg:gap-4 m-0'
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className='w-auto'>
            <div
              className='relative rounded-lg w-[60px] h-[60px] md:w-[100px] md:h-[100px] cursor-pointer'
              onClick={() => handleThumbnailClick(index)}
              onMouseEnter={() => handleThumbnailClick(index)}
            >
              <Image
                className='rounded-lg object-cover'
                src={img.url}
                alt={`Image ${index + 1}`}
                layout='fill'
                objectFit='cover'
                objectPosition='top'
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Flex className='flex justify-center w-full lg:w-auto'>
        <Swiper
          onSlideChange={handleSlideChange}
          initialSlide={selectedImage}
          spaceBetween={10}
          slidesPerView={1}
          className='relative w-full sm:w-[400px] h-[350px] sm:h-[400px]'
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                src={img.url}
                className='object-cover'
                alt={`Image ${index + 1}`}
                layout='fill'
                objectFit='cover'
                objectPosition='top'
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Flex>
    </Flex>
  );
};

export default ImageGallery;
