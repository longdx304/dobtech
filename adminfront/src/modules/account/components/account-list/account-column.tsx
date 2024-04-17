import { Pencil, User, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IAdminResponse } from '@/types/account';
import { User as TUser } from '@medusajs/medusa';

interface Props {
	handleDeleteUser: (userId: TUser['id']) => void;
	handleEditUser: (record: IAdminResponse) => void;
}

const accountColumns = ({ handleDeleteUser, handleEditUser }: Props) => [
	{
		title: 'Avatar',
		dataIndex: 'first_name',
		key: 'first_name',
		width: 40,
		render: (text: string) => <Avatar icon={<User />} />,
	},
	{
		title: 'Thông tin',
		key: 'information',
		render: (_: any, record: any) => (
			<Flex vertical gap="small">
				<Text strong>{record.first_name}</Text>
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
				/>
				<Button
					onClick={() => handleDeleteUser(record.id)}
					type="text"
					shape="circle"
					icon={<X color="red" />}
				/>
			</Flex>
		),
	},
];

export default accountColumns;
