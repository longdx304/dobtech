import { FC, ReactNode } from 'react';
import { Image as AntdImage, ImageProps } from 'antd';
import { cn } from '@/lib/utils';
import { normalizeMedusaAssetUrl } from '@/lib/utils/medusa-asset-url';

interface Props extends ImageProps {
	className?: string;
	children?: ReactNode;
}
const Image: FC<Props> = ({ className, children, src, ...props }) => {
	const normalizedSrc =
		typeof src === 'string' ? normalizeMedusaAssetUrl(src) : src;
	return (
		<AntdImage
			className={cn('', className)}
			src={normalizedSrc}
			{...props}
		>
			{children}
		</AntdImage>
	);
};

export default Image;
