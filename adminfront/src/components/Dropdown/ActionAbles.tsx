import React, { FC } from 'react';
import { Ellipsis } from 'lucide-react';
import type { MenuProps } from 'antd';

import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/Dropdown';

type Props = {
	actions: MenuProps['items'];
	onMenuClick?: MenuProps['onClick'];
};

const ActionAbles: FC<Props> = ({ actions, onMenuClick }) => {
	return (
		<Dropdown menu={{ items: actions, onClick: onMenuClick }}>
			<a onClick={(e) => e.preventDefault()}>
				<Ellipsis size={20} color="#6B7280" />
			</a>
		</Dropdown>
	);
};

export default ActionAbles;