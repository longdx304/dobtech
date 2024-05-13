'use client';
import { Modal as AntdModal, ModalProps, Form } from 'antd';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from '@/components/Button';

interface Props extends ModalProps {
	className?: string;
	children?: ReactNode;
	handleCancel: () => void;
	form: any;
	isLoading?: boolean;
}

export default function SubmitModal({
	handleCancel,
	className,
	form,
	children,
	isLoading,
	...props
}: Props) {
	return (
		<AntdModal
			className={cn('', className)}
			// afterClose={() => form.resetFields()}
			onCancel={handleCancel}
			footer={[
				<Button key="1" type="default" danger onClick={handleCancel} loading={isLoading}>
					Huỷ
				</Button>,
				<Button
					htmlType="submit"
					key="submit"
					onClick={() => form?.submit()}
					data-testid="submitButton"
					loading={isLoading}
				>
					Xác nhận
				</Button>
			]}
			{...props}
		>
			{children}
		</AntdModal>
	);
}
