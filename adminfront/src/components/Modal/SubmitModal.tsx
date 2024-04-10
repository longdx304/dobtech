import { Modal as AntdModal, ModalProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button, SubmitButton } from '@/components/Button';

interface Props extends ModalProps {
	className?: string;
	children?: ReactNode;
	handleSubmit?: () => void;
	handleCancel: () => void;
	formAction: () => any;
}

export default function SubmitModal({
	handleCancel,
	formAction,
	className,
	children,
	...props
}: Props) {
	return (
		<AntdModal
			className={cn('', className)}
			footer={[
				<Button key="1" type="default" danger onClick={handleCancel}>
					Huỷ
				</Button>,
				<SubmitButton key="2" form="modal">Xác nhận</SubmitButton>,
			]}
			{...props}
		>
			<form action={formAction} id="modal" className="w-full space-y-4">
				{children}
			</form>
		</AntdModal>
	);
}
