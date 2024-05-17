import { Avatar, Divider, Rate } from 'antd';
import { User } from 'lucide-react';
import React from 'react';

type ReviewCardProps = {
  rating?: number;
  reviewText?: string;
  reviewerName?: string;
  reviewDate?: string;
};

const ProductReviews = ({
  rating,
  reviewText,
  reviewerName,
  reviewDate,
}: ReviewCardProps) => {
  return (
    <div className='product-rating rounded-sm shadow mt-2 p-8'>
      <div className='flex items-center mb-4'>
        <div className='font-bold text-xl mr-4'>ĐÁNH GIÁ SẢN PHẨM</div>
      </div>
      <div className='flex items-center bg-[#fffbf8] rounded-sm box-border mb-4 min-h-4 p-7 shadow-sm'>
        <div className='text-center mr-7'>
          <div className='text-rose-600 text-lg'>
            <span className='text-2xl'>4.7</span>
            <span className='text-lg'> trên 5 </span>
          </div>
          <div className='mt-2 text-lg'>
            <Rate disabled defaultValue={4} />
          </div>
        </div>
        {/* Review stars */}
        <div className='flex-1 ml-3'>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            tất cả
          </div>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            5 sao
          </div>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            4 sao
          </div>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            3 sao
          </div>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            2 sao
          </div>
          <div className='bg-white shadow rounded-sm box-border cursor-pointer h-8 inline-block leading-8 my-3 mr-3 min-w-12 px-3 text-center capitalize'>
            1 sao
          </div>
        </div>
      </div>

      {/* List comments */}
      <div>
        <div className='flex items-start py-4 px-2'>
          <Avatar icon={<User />} />
          <div>
            <div className='flex flex-col'>
              <div className='font-semibold text-lg ml-3'>Nguyễn Văn A</div>
              <div className='ml-3'>
                <Rate disabled defaultValue={4} />
              </div>
            </div>
            <div className='text-gray-500 text-sm mt-1 ml-3'>5 ngày trước</div>
            <div className='mt-2 ml-3'>
              Sản phẩm rất tốt, chất lượng tuyệt vời, giá cả hợp lý
            </div>
          </div>
        </div>
        <Divider />
        <div className='flex items-start py-4 px-2'>
          <Avatar icon={<User />} />
          <div>
            <div className='flex flex-col'>
              <div className='font-semibold text-lg ml-3'>Nguyễn Văn A</div>
              <div className='ml-3'>
                <Rate disabled defaultValue={4} />
              </div>
            </div>
            <div className='text-gray-500 text-sm mt-1 ml-3'>5 ngày trước</div>
            <div className='mt-2 ml-3'>
              Sản phẩm rất tốt, chất lượng tuyệt vời, giá cả hợp lý
            </div>
          </div>
        </div>
        <Divider />
        <div className='flex items-start py-4 px-2'>
          <Avatar icon={<User />} />
          <div>
            <div className='flex flex-col'>
              <div className='font-semibold text-lg ml-3'>Nguyễn Văn A</div>
              <div className='ml-3'>
                <Rate disabled defaultValue={4} />
              </div>
            </div>
            <div className='text-gray-500 text-sm mt-1 ml-3'>5 ngày trước</div>
            <div className='mt-2 ml-3'>
              Sản phẩm rất tốt, chất lượng tuyệt vời, giá cả hợp lý
            </div>
          </div>
        </div>
        <Divider />
      </div>
    </div>
  );
};

export default ProductReviews;
