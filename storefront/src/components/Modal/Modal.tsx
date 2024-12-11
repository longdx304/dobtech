import { Modal as AntdModal, ModalProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends ModalProps {
	className?: string;
	children?: ReactNode;
}

export default function Modal({ className, children, ...props }: Props) {
	return (
		<AntdModal
			className={cn('', className)}
			{...props}
			styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' } }}
		>
			{children}
		</AntdModal>
	);
}
