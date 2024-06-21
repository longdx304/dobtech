import type { MenuProps } from 'antd';
import { Ellipsis } from 'lucide-react';
import { FC } from 'react';

import { Dropdown } from '@/components/Dropdown';

type Props = {
	actions: MenuProps['items'];
	onMenuClick?: MenuProps['onClick'];
	id?: string;
};

const ActionAbles: FC<Props> = ({ actions, onMenuClick, id }) => {
	return (
		<Dropdown menu={{ items: actions, onClick: onMenuClick, id: id }}>
			<a onClick={(e) => e.preventDefault()} data-testid="action-ables">
				<Ellipsis size={20} color="#6B7280" />
			</a>
		</Dropdown>
	);
};

export default ActionAbles;
