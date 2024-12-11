'use client';

import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { Image } from '@/components/Image';
import { useProduct } from '@/lib/providers/product/product-provider';
import { useMemo, useRef, useState, useEffect } from 'react';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useVariantImages } from '@/lib/providers/product/variant-images-provider';

import 'swiper/css';
import 'swiper/css/pagination';
import clsx from 'clsx';

type Props = {
	isImgVertical?: boolean;
	isModal?: boolean;
};
export default function ImageGallery({
	isImgVertical = false,
	isModal = false,
}: Readonly<Props>) {
	const { optionValue } = useVariantImages();
	const { product } = useProduct();

	const images = useMemo(() => {
		if (!product) return null;

		if (!Array.isArray(product.images) || product.images.length === 0) {
			if (!product.thumbnail) {
				return ['/images/product-img.webp'];
			}
			return [product.thumbnail];
		}

		return product.images;
	}, [product]);

	const variantImg = product?.metadata?.variant_images
		? JSON.parse(product?.metadata?.variant_images as string)
		: null;

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

	useEffect(() => {
		if (images && variantImg && optionValue) {
			const imageId = variantImg.find(
				(item: Record<string, string>) => item.variant_value === optionValue
			)?.image_url;
			const index = images.findIndex((img: any) => img.url === imageId);
			if (index !== -1) {
				setSelectedImage(index);
				if (mainSwiperRef.current) {
					mainSwiperRef.current.slideTo(index);
				}
			}
		}
	}, [optionValue, variantImg, images]);

	return (
		<Flex
			className={cn(
				'flex flex-col-reverse lg:flex-row justify-end items-start gap-4 w-full overflow-x-auto lg:h-fit lg:w-auto',
				!isImgVertical && 'lg:flex-col-reverse'
			)}
		>
			{/* Thumbnails images */}
			<div
				className={clsx('w-full h-full overflow-x-auto', {
					'h-fit': isModal,
				})}
			>
				<div
					className={cn(
						'flex flex-nowrap justify-center w-full lg:h-full gap-4 lg:overflow-y-auto h-fit overflow-x-auto',
						'custom-scrollbar',
						!isImgVertical && 'lg:flex-row',
						isModal &&
							'flex-nowrap overflow-x-auto w-auto h-auto gap-2 justify-start'
					)}
				>
					{images?.map((img, index) => (
						<Flex
							key={typeof img === 'string' ? index : img.url}
							onClick={() => handleThumbnailClick(index)}
							className={`flex-none cursor-pointer w-24 h-24 lg:w-20 lg:h-20 rounded-sm overflow-hidden border ${
								selectedImage === index ? 'border-primary' : 'border-gray-200'
							}`}
							onMouseEnter={() => handleThumbnailClick(index)}
						>
							<Image
								src={typeof img === 'string' ? img : img.url}
								className="object-contain object-center w-24 h-24 lg:w-20 lg:h-20"
								alt={`Thumbnail ${index + 1}`}
								preview={false}
							/>
						</Flex>
					))}
				</div>
			</div>
			{/* Main Image */}
			<Flex className={clsx('flex justify-center w-full')}>
				<Swiper
					onSlideChange={handleSlideChange}
					className={clsx(
						'relative w-full sm:w-[400px] h-[350px] sm:h-[400px]',
						{
							'sm:w-full': isModal,
						}
					)}
					onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
					modules={[Pagination]}
					slidesPerView={1}
					pagination={{ clickable: true }}
					hashNavigation={{ watchState: true }}
				>
					{images?.map((img, index) => (
						<SwiperSlide
							key={typeof img === 'string' ? index : img.url}
							data-hash={typeof img === 'string' ? null : img.id}
						>
							<Image
								src={typeof img === 'string' ? img : img.url}
								className="rounded-sm object-contain"
								alt={`Image ${index + 1}`}
								width="inherit"
								height="inherit"
							/>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Global styles for custom scrollbar */}
				<style jsx global>{`
					.custom-scrollbar::-webkit-scrollbar {
						width: 5px;
						height: 5px;
					}
					.custom-scrollbar::-webkit-scrollbar-track {
						background: #f1f1f1;
						border-radius: 10px;
					}
					.custom-scrollbar::-webkit-scrollbar-thumb {
						background: #888;
						border-radius: 10px;
					}
					.custom-scrollbar::-webkit-scrollbar-thumb:hover {
						background: #555;
					}
				`}</style>
			</Flex>
		</Flex>
	);
}
