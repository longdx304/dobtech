// @ts-nocheck
import { Modal } from '@/components/Modal';
import ProductActions from '../../components/product-actions';
import ImageGallery from '../../components/image-gallery';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	productHandle: string;
};

const ProductTemplateModal = ({ state, handleOk, handleCancel, productHandle }: Props) => {
	return (
		<Modal
			open={state}
			handleOk={handleCancel}
			onCancel={handleCancel}
			footer={null}
			width={800}
		>
			<div className='flex flex-col lg:flex-row justify-between w-full pb-8 gap-4'>
        <div className='w-full lg:w-fit lg:flex-grow lg:pr-4'>
          <ImageGallery isImgVertical={false} />
        </div>
        <div className='w-full lg:w-full lg:flex-grow lg:pl-4'>
					<ProductActions handleCancel={handleCancel} />
        </div>
      </div>
		</Modal>
	);
};

export default ProductTemplateModal;
