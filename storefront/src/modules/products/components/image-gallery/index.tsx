'use client';

import { Image as MedusaImage } from '@medusajs/medusa';
import { Flex } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

type ImageGalleryProps = {
  images: MedusaImage[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <Flex className='flex flex-col-reverse lg:flex-row justify-center items-center gap-4 w-full lg:w-[730px]'>
      <Flex className='flex flex-row lg:flex-col justify-center gap-2 lg:gap-4'>
        {images.map((img, index) => (
          <Flex
            key={index}
            className='relative rounded-lg w-[60px] h-[60px] md:w-[100px] md:h-[100px] cursor-pointer'
            onClick={() => setSelectedImage(index)}
            onMouseEnter={() => setSelectedImage(index)}
          >
            <Image
              className='rounded-lg object-cover'
              src={img.url}
              alt={`Image ${index + 1}`}
              layout='fill'
              objectFit='cover'
              objectPosition='top'
            />
          </Flex>
        ))}
      </Flex>

      <Flex className='flex justify-center w-full lg:w-auto'>
        <Flex className='relative h-[300px] w-full sm:h-[600px] lg:h-[600px] lg:w-[600px]'>
          <Image
            src={images[selectedImage]?.url || images[0]?.url}
            className='object-cover'
            alt=''
            layout='fill'
            objectFit='cover'
            objectPosition='top'
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ImageGallery;
