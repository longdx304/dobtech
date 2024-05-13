import { FC, useEffect } from 'react';
import { Form, Row, Col, message } from 'antd';
import { ProductCollection } from '@medusajs/medusa';
import { CircleAlert } from 'lucide-react';
import _ from 'lodash';

import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import {
	useAdminCreateCollection,
	useAdminUpdateCollection,
} from 'medusa-react';
import { getErrorMessage } from '@/lib/utils';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	collection: ProductCollection | null;
};

const ManageProductModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	collection,
}) => {
	console.log('collection product', collection);
	return (
		<Modal
			title={'Sản phẩm'}
			open={state}
			onOk={handleOk}
			handleCancel={handleCancel}
			width={800}
			// isLoading={createCollection?.isLoading || updateCollection?.isLoading}
		>
			123
		</Modal>
	);
};

export default ManageProductModal;
