import { Text } from '@/components/Typography';
import { ProductVariant } from '@medusajs/medusa';

type LineItemOptionsProps = {
	variant: ProductVariant;
	'data-testid'?: string;
	'data-value'?: ProductVariant;
};

const LineItemOptions = ({
	variant,
	'data-testid': dataTestid,
	'data-value': dataValue,
}: LineItemOptionsProps) => {
	return (
		<Text
			data-testid={dataTestid}
			data-value={dataValue}
			className="inline-block text-sm w-full overflow-hidden text-ellipsis flex items-center cursor-pointer"
		>
			{variant.title}
		</Text>
	);
};

export default LineItemOptions;
