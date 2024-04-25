import { Pencil, User, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Typography';
import { IAdminResponse, rolesEmployee } from '@/types/account';
import { User as TUser } from '@medusajs/medusa';

const COLOR_PERMISSION = {
	'warehouse-manager': 'red',
	'warehouse-staff': 'orange',
	driver: 'lime',
	'assistant-driver': 'blue',
	'inventory-checker': 'purple',
};

interface Props {
	handleDeleteUser: (userId: IAdminResponse['id']) => void;
	handleEditUser: (record: IAdminResponse) => void;
}

const accountColumns= ({
	handleDeleteUser,
	handleEditUser,
}: Props) => [
	{
		title: 'Avatar',
		dataIndex: 'first_name',
		key: 'first_name',
		width: 40,
		render: (text: any) => <Avatar icon={<User />} />,
	},
	{
		title: 'Thông tin',
		key: 'information',
		render: (_: any, record: any) => (
			<Flex vertical gap="middle">
				<Flex vertical>
					<Text strong>{record.first_name}</Text>
					<Text typeStyle={'secondary'} className="text-xs">
						{record.phone}
					</Text>
				</Flex>
				<Flex wrap="wrap" gap="small">
					{record?.permissions?.split(',').map((permission: any) => (
						<Tag
							key={permission}
							color={COLOR_PERMISSION[permission as keyof typeof COLOR_PERMISSION]}
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
		render: (_: any, record: any) => (
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
