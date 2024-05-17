import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends AntdButtonProps {
  className?: string;
	isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  className,
  type = 'primary',
	isLoading,
  children,
  icon,
  ...props
}: Props) {
  return (
    <AntdButton
      className={cn('leading-none', className)}
      type={type}
      size='large'
			loading={isLoading}
      {...props}
      icon={icon}
    >
      {children}
    </AntdButton>
  );
}
