import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends AntdInputProps {
	className?: string;
	error?: string;
	rows?: number;
}

const { TextArea: AntdTextArea } = AntdInput;

export default function TextArea({
	rows = 3,
	error,
	className,
}: Props) {
	return (
		<Flex vertical gap={4} className="w-full">
			<AntdTextArea
				rows={rows}
				size="large"
				className={cn('p-3 gap-2', className)}
			/>
			{error && <ErrorText error={error} />}
		</Flex>
	);
}