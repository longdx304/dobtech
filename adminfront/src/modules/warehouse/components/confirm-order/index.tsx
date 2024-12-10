import { Modal } from '@/components/Modal';
import React from 'react';

type Props = {
	state: boolean;
  title: string;
	children?: React.ReactNode;
	handleOk: () => void;
	handleCancel: () => void;
};
const ConfirmOrder: React.FC<Props> = ({
	state,
  title,
	children,
	handleOk,
	handleCancel,
}) => {
	return (
		<Modal
			open={state}
			title={title}
			width={600}
			handleOk={handleOk}
			handleCancel={handleCancel}
		>
			{children}
		</Modal>
	);
};

export default ConfirmOrder;
