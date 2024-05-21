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
    <div className='flex flex-col-reverse lg:flex-row justify-center items-center gap-4 w-full lg:w-[730px]'>
      <div className='lg:flex-col flex-row justify-center flex gap-4 mt-4'>
        {images.map((img, index) => (
          <div key={index} className='relative rounded-lg'>
            <Image
              onClick={() => setSelectedImage(index)}
              className='w-[100px] h-[100px] rounded-lg mb-3 p-1 object-cover object-top cursor-pointer'
              src={img.url}
              alt={`Image ${index + 1}`}
              width={70}
              height={70}
              onMouseEnter={() => setSelectedImage(index)}
            />
          </div>
        ))}
      </div>
      <div className='flex justify-center'>
        <Image
          src={images[selectedImage]?.url || images[0]?.url}
          className='h-[600px] w-auto object-cover object-top'
          alt=''
          width={600}
          height={600}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
