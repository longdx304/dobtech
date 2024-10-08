'use client';
import { cn } from '@/lib/utils';
import PlaceholderImage from '@/modules/common/components/placeholder-image';
import Image from 'next/image';
import { FC } from 'react';

interface Props {
	thumbnail?: string | null;
	className?: string;
	size?: 'small' | 'medium' | 'large' | 'full' | 'square';
}

const Thumbnail: FC<Props> = ({ thumbnail, size, className }) => {

	return (
		<div
			className={cn(
				'relative w-full overflow-hidden aspect-[3/4] rounded',
				className
			)}
		>
			{thumbnail ? (
				<Image
					src={thumbnail}
					alt="Product Thumbnail"
					className="absolute inset-0 object-cover object-center group-hover:scale-110 transition-all"
					draggable={false}
					sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
					quality={75}
					fill
					priority
				/>
			) : (
				<div className="w-full h-full absolute inset-0 flex items-center justify-center bg-slate-200 group-hover:scale-110 transition-all">
					<PlaceholderImage size={size} color="#64748b" />
				</div>
			)}
		</div>
	);
};

export default Thumbnail;
