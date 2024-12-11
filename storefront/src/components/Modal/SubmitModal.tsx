'use client';
import { Modal as AntdModal, ModalProps } from 'antd';
import { ReactNode } from 'react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

interface Props extends ModalProps {
  className?: string;
  children?: ReactNode;
  handleCancel: () => void;
  form?: any;
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
      onCancel={handleCancel}
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' } }}
      footer={[
        <Button key='1' type='default' danger onClick={handleCancel}>
          Huỷ
        </Button>,
        <Button
          htmlType='submit'
          key='submit'
          onClick={() => form?.submit()}
          data-testid='submitButton'
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
