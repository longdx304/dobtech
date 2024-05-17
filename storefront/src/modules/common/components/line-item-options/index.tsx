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
      className='inline-block text-md w-full overflow-hidden text-ellipsis'
    >
      Variant: {variant.title}
    </Text>
  );
};

export default LineItemOptions;
