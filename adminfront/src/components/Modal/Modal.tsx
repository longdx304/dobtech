import { Modal as AntdModal, ModalProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

import { Button, SubmitButton } from '@/components/Button';

interface Props extends ModalProps {
	className?: string;
	children?: ReactNode;
	handleCancel: () => void;
	handleOk: () => void;
	isLoading?: boolean;
}

export default function Modal({
	className,
	handleOk,
	handleCancel,
	isLoading,
	children,
	...props
}: Props) {
	return (
		<AntdModal
			className={cn('', className)}
			onCancel={handleCancel}
			footer={[
				<Button key="1" type="default" danger onClick={handleCancel} loading={isLoading}>
					Huỷ
				</Button>,
				<Button
					htmlType="submit"
					key="submit"
					onClick={handleOk}
					loading={isLoading}
					data-testid="submitButton"
				>
					Xác nhận
				</Button>,
			]}
			{...props}
		>
			{children}
		</AntdModal>
	);
}
