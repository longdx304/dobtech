import repeat from '@/lib/utils/repeat';
import SkeletonProductPreview from '../../components/skeleton-product-preview';

const SkeletonRelatedProducts = () => {
  return (
    <div className='product-page-constraint'>
      <div className='flex flex-col gap-8 items-center text-center mb-8'>
        <div className='w-20 h-6 animate-pulse bg-gray-100'></div>
        <div className='flex flex-col gap-4 items-center text-center mb-16'>
          <div className='w-96 h-10 animate-pulse bg-gray-100'></div>
          <div className='w-48 h-10 animate-pulse bg-gray-100'></div>
        </div>
      </div>

      <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 w-full gap-x-6 gap-y-6'>
        {repeat(3).map((index: any) => (
          <SkeletonProductPreview key={index} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonRelatedProducts;
