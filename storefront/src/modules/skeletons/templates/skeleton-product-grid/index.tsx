import repeat from '@/lib/utils/repeat';
import SkeletonProductPreview from '../../components/skeleton-product-preview';

const SkeletonProductGrid = () => {
  return (
    <ul
      className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 list-none'
      data-testid='products-list-loader'
    >
      {repeat(8).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  );
};

export default SkeletonProductGrid;
