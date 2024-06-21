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
	footer?: ReactNode;
}

export default function SubmitModal({
	handleCancel,
	className,
	form,
	children,
	isLoading,
	footer = null,
	...props
}: Props) {
	const renderFooter = () => {
		if (footer) return footer;
		return [
			<Button
				key="1"
				type="default"
				danger
				onClick={handleCancel}
				loading={isLoading}
			>
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
			</Button>,
		];
	};
	return (
		<AntdModal
			className={cn('', className)}
			// afterClose={() => form.resetFields()}
			onCancel={handleCancel}
			footer={renderFooter()}
			{...props}
		>
			{children}
		</AntdModal>
	);
}
