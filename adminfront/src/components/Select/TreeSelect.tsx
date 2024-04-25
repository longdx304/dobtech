import { cn } from '@/lib/utils';

import { TreeSelect as AntdTreeSelect, TreeSelectProps } from 'antd';

const { SHOW_PARENT } = AntdTreeSelect;

interface Props extends TreeSelectProps {
	className?: string;
	title: string;
	treeData: any;
	value: any;
	onChange: (value: any) => void;
}

export default function TreeSelect({
	className,
	treeData,
	value,
	title,
	onChange,
}: Props) {
	const tProps = {
		treeData,
		value,
		onChange,
		treeCheckable: true,
		showCheckedStrategy: SHOW_PARENT,
		placeholder: title,
		style: {
			width: '100%',
		},
	};

	return (
		<AntdTreeSelect
			size="large"
			className={cn('', className)}
			// treeLine={true}
			{...tProps}
		/>
	);
}
