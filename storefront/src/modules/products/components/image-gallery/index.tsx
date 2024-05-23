'use client';

import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { useMemo, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useProduct } from '@/lib/providers/product/product-provider';

type ImageGalleryProps = {
  // images: MedusaImage[] | string | null;
};

const ImageGallery = ({}: ImageGalleryProps) => {
  const { product } = useProduct();

  const images = useMemo(() => {
    if (Array.isArray(product?.images)) {
      return product.thumbnail;
    } else if (product?.thumbnail === null) {
      return '/images/product-img.png';
    }
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

  return (
    <Flex className='flex flex-col-reverse lg:flex-row items-center gap-4 w-full'>
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
        {typeof images === 'string' ? (
          <SwiperSlide className='w-auto'>
            <div className='relative rounded-lg w-[60px] h-[60px] md:w-[80px] md:h-[80px] cursor-pointer'>
              <Image
                className='rounded-lg object-contain'
                src={images}
                alt={`Image 1`}
                width='inherit'
                height='inherit'
                preview={false}
              />
            </div>
          </SwiperSlide>
        ) : (
          <div className='relative rounded-lg w-[60px] h-[60px] md:w-[80px] md:h-[80px] cursor-pointer'>
            <Image
              className='rounded-lg object-contain'
              src={'/images/product-img.png'}
              alt={`Image 1`}
              width='inherit'
              height='inherit'
              preview={false}
            />
          </div>
        )}
        {Array.isArray(images) &&
          images.map((img, index) => (
            <SwiperSlide key={index} className='w-auto'>
              <div
                className='relative rounded-lg w-[60px] h-[60px] md:w-[100px] md:h-[100px] cursor-pointer'
                onClick={() => handleThumbnailClick(index)}
                onMouseEnter={() => handleThumbnailClick(index)}
              >
                <Image
                  className='rounded-lg object-cover w-[60px] h-[60px] md:w-[100px] md:h-[100px]'
                  src={img?.url}
                  alt={`Image ${index + 1}`}
                  width='inherit'
                  height='inherit'
                  preview={false}
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Main images */}
      <Flex className='flex justify-center w-full lg:w-auto'>
        <Swiper
          onSlideChange={handleSlideChange}
          initialSlide={selectedImage}
          spaceBetween={10}
          slidesPerView={1}
          className='relative w-full sm:w-[400px] h-[350px] sm:h-[400px]'
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        >
          {typeof images === 'string' ? (
            <SwiperSlide>
              <div className='relative w-full h-full'>
                <Image
                  className='rounded-lg object-contain w-full sm:w-[500px] h-[350px] sm:h-[400px]'
                  src={images}
                  alt={`Image 1`}
                />
              </div>
            </SwiperSlide>
          ) : (
            <div className='relative w-full h-full'>
              <Image
                className='rounded-lg object-cover w-full sm:w-[400px] h-[350px] sm:h-[400px]'
                src='/images/product-img.png'
                alt={`Image 1`}
              />
            </div>
          )}
          {Array.isArray(images) &&
            images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className='relative w-full h-full'>
                  <Image
                    className='rounded-lg object-contain'
                    src={img?.url}
                    alt={`Image ${index + 1}`}
                    width='inherit'
                    height='inherit'
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </Flex>
    </Flex>
  );
};

export default ImageGallery;
