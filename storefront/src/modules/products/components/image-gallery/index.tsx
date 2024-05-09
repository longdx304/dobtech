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
    <Flex className='images flex justify-center items-center gap-4 w-[730px]'>
      <Flex className='all-images flex flex-col justify-center'>
        {images.map((img, index) => (
          <div key={index} className='image relative rounded-lg'>
            <Image
              onClick={() => setSelectedImage(index)}
              className='w-[70px] h-[70px] rounded-lg mb-3 p-1 object-cover object-top cursor-pointer'
              src={img.url}
              alt={`Image ${index + 1}`}
              width={70}
              height={70}
              onMouseEnter={() => setSelectedImage(index)}
            />
          </div>
        ))}
      </Flex>
      <Flex className='selected-image'>
        <Image
          src={images[selectedImage]?.url || images[0]?.url}
          className='h-[600px] w-auto object-cover object-top'
          alt=''
          width={600}
          height={600}
        />
      </Flex>
    </Flex>
  );
};

export default ImageGallery;
