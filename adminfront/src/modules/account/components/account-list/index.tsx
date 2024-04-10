'use client';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { FloatButton } from '@/components/Button';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/Button';
import AccountModal from '@/modules/account/components/account-modal';
import accountColumns from './account-column';
import useToggleState from '@/lib/hooks/use-toggle-state';

interface Props {}

const AccountList = ({}: Props) => {
	const columns = useMemo(() => accountColumns, []);
	const { state, onOpen, onClose } = useToggleState(false);

	return (
		<Card className="w-full">
			<Table columns={columns} dataSource={[]} />
			<FloatButton
				className="absolute"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
			/>
			<AccountModal state={state} handleOk={onClose} handleCancel={onClose} />
		</Card>
	);
};

export default AccountList;
