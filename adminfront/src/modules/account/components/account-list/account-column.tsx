import type { TableProps } from 'antd';
import { User, Pencil, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { User as TUser } from '@medusajs/medusa';
import { rolesEmployee } from '@/types/account';

const COLOR_PERMISSION = {
	'warehouse-manager': 'red',
	'warehouse-staff': 'orange',
	driver: 'lime',
	'assistant-driver': 'blue',
	'inventory-checker': 'purple',
};

interface Props {
	handleDeleteUser: (userId: TUser['id']) => void;
	handleEditUser: (record: TUser) => void;
}

const accountColumns: TableProps<any>['columns'] = ({
	handleDeleteUser,
	handleEditUser,
}: Props) => [
	{
		title: 'Avatar',
		dataIndex: 'first_name',
		key: 'first_name',
		width: 40,
		render: (text) => <Avatar icon={<User />} />,
	},
	{
		title: 'Thông tin',
		key: 'information',
		render: (_, record) => (
			<Flex vertical gap="middle">
				<Flex vertical>
					<Text strong>{record.first_name}</Text>
					<Text type="secondary" className="text-xs">
						{record.phone}
					</Text>
				</Flex>
				<Flex wrap="wrap" gap="small">
					{record.permissions.split(',').map((permission) => (
						<Tag
							key={permission}
							color={COLOR_PERMISSION[permission] as keyof COLOR_PERMISSION}
						>
							{rolesEmployee.find((item) => item.value === permission)?.label}
						</Tag>
					))}
				</Flex>
			</Flex>
		),
	},
	{
		title: 'Action',
		key: 'action',
		width: 40,
		render: (_, record) => (
			<Flex>
				<Button
					onClick={() => handleEditUser(record)}
					type="text"
					shape="circle"
					icon={<Pencil />}
					data-testid="editUser"
				/>
				<Button
					onClick={() => handleDeleteUser(record.id)}
					type="text"
					shape="circle"
					icon={<X color="red" />}
					data-testid="deleteUser"
				/>
			</Flex>
		),
	},
];

export default accountColumns;
