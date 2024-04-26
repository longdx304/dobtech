import { FC } from "react";
import Image from "next/image";
import PlaceholderImage from "@/modules/common/components/placeholder-image";

interface Props {
	thumbnail?: string | null;
	className?: string;
}

const Thumbnail: FC<Props> = ({ thumbnail, className }) => {
	return (
		<div className="relative w-full overflow-hidden aspect-square ">
			{thumbnail ? (
				<Image
					src={thumbnail}
					alt="Product Thumbnail"
					className="absolute inset-0 object-cover object-center group-hover:scale-110 transition-all"
					draggable={false}
					quality={50}
					sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
					fill
				/>
			) : (
				<div className="w-full h-full absolute inset-0 flex items-center justify-center bg-slate-200 group-hover:scale-110 transition-all">
					<PlaceholderImage size="64" color="#64748b" />
				</div>
			)}
		</div>
	);
};

export default Thumbnail;
