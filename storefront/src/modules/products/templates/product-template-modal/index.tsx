import { Modal } from '@/components/Modal';
import ImageGallery from '@/modules/products/components/image-gallery';
import ProductActions from '@/modules/products/components/product-actions';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	productHandle: string;
};

const ProductTemplateModal = ({
	state,
	handleOk,
	handleCancel,
	productHandle,
}: Props) => {
	return (
		<Modal open={state} onCancel={handleCancel} footer={null} width={800}>
			<div className="flex flex-col lg:flex-row justify-between w-full pb-8 gap-4">
				<div className="w-full lg:w-1/2 lg:flex-grow lg:pr-4">
					<ImageGallery isImgVertical={false} isModal={state} />
				</div>
				<div className="w-full lg:w-1/2 lg:flex-grow lg:pl-4">
					<ProductActions handleCancel={handleCancel} />
				</div>
			</div>
		</Modal>
	);
};

export default ProductTemplateModal;
