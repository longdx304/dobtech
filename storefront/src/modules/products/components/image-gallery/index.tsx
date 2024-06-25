"use client";
import { cn } from '@/lib/utils';
import { Flex } from "@/components/Flex";
import { Image } from "@/components/Image";
import { useProduct } from "@/lib/providers/product/product-provider";
import { useMemo, useRef, useState, useEffect } from "react";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useVariantImages } from "@/lib/providers/product/variant-images-provider";

import "swiper/css";
import "swiper/css/pagination";

type Props = {
	isImgVertical?: boolean;
};
export default function ImageGallery({ isImgVertical = true }: Props) {
	const { optionValue } = useVariantImages();
	const { product } = useProduct();

	const images = useMemo(() => {
		if (!product) return null;

		if (!Array.isArray(product.images) || product.images.length === 0) {
			if (!product.thumbnail) {
				return ["/images/product-img.png"];
			}
			return [product.thumbnail];
		}

		return product.images;
	}, [product]);

	const variantImg = product?.metadata?.variant_images ? JSON.parse(
		(product?.metadata?.variant_images as string)
	) : null;

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
			const imageId = variantImg.find((item: Record<string, string>) => item.variant_value === optionValue)?.image_id;
			const index = images.findIndex((img: any) => img.id === imageId);
			if (index !== -1) {
				setSelectedImage(index);
				if (mainSwiperRef.current) {
					mainSwiperRef.current.slideTo(index);
				}
			}
		}
	}, [optionValue, variantImg, images])

	return (
		<Flex className={cn("flex flex-col-reverse lg:flex-row justify-center items-center gap-4 w-full lg:w-auto", !isImgVertical && "lg:flex-col-reverse")}>
			{/* Thumbnails */}
			<Flex className={cn("flex flex-wrap lg:flex-col justify-center w-full lg:w-fit gap-4", !isImgVertical && "lg:flex-row")}>
				{images?.map((img, index) => (
					<Flex
						key={index}
						onClick={() => handleThumbnailClick(index)}
						className={`cursor-pointer w-16 h-16 lg:w-20 lg:h-20 rounded-sm overflow-hidden border border-gray-200 ${
							selectedImage === index ? "border-primary" : ""
						}`}
						onMouseEnter={() => handleThumbnailClick(index)}
					>
						<Image
							src={typeof img === "string" ? img : img.url}
							className="object-cover"
							alt={`Thumbnail ${index + 1}`}
							width="inherit"
							height="inherit"
							preview={false}
						/>
					</Flex>
				))}
			</Flex>

			{/* Main Image */}
			<Flex className="flex justify-center w-full lg:w-auto">
				<Swiper
					onSlideChange={handleSlideChange}
					className="relative w-full sm:w-[400px] h-[350px] sm:h-[400px]"
					onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
					modules={[Pagination]}
					slidesPerView={1}
					pagination={{ clickable: true }}
					hashNavigation={{ watchState: true }}
				>
					{images?.map((img, index) => (
						<SwiperSlide
							key={index}
							data-hash={typeof img === "string" ? null : img.id}
						>
							<Image
								src={typeof img === "string" ? img : img.url}
								className="rounded-sm object-contain"
								alt={`Image ${index + 1}`}
								width="inherit"
								height="inherit"
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</Flex>
		</Flex>
	);
}
