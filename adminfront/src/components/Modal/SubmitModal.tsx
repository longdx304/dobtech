'use client';
import { Modal as AntdModal, ModalProps, Form } from 'antd';
import { ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button, SubmitButton } from '@/components/Button';

interface Props extends ModalProps {
	className?: string;
	children?: ReactNode;
	handleCancel: () => void;
	form?: any; // Form action when submit modal
}

export default function SubmitModal({
	handleCancel,
	className,
	form,
	children,
	...props
}: Props) {
	return (
		<AntdModal
			className={cn('', className)}
			// afterClose={() => form.resetFields()}
			onCancel={handleCancel}
			footer={[
				<Button key="1" type="default" danger onClick={handleCancel}>
					Huỷ
				</Button>,
				<Button
					htmlType="submit"
					key="submit"
					onClick={() => form?.submit()}
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
