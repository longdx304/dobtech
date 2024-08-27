import type { MenuProps } from 'antd';
import { Ellipsis } from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';

type Props = {
	actions: MenuProps['items'];
	onMenuClick?: MenuProps['onClick'];
	id?: string;
};

export default function ActionAbles({ actions, onMenuClick, id }: Props) {
	return (
		<Dropdown menu={{ items: actions, onClick: onMenuClick, id: id }}>
			<a
				onClick={(e) => e.stopPropagation()}
				className="flex items-center"
				data-testid="action-ables"
			>
				<Ellipsis size={20} color="#6B7280" />
			</a>
		</Dropdown>
	);
}
