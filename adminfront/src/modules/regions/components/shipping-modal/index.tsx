import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import { Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import _ from 'lodash';
import { useAdminShippingOptions } from 'medusa-react';
import shippingColumns from './shipping-columns';
import { ShippingOption } from '@medusajs/medusa';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	regionId: string;
};

const PAGE_SIZE = 10;
const ShippingModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	regionId,
}) => {
	const { shipping_options: shippingOptions, isLoading: isLoadingShipping } = useAdminShippingOptions({
    region_id: regionId,
    is_return: false,
  })

	const { shipping_options: returnShippingOptions, isLoading: isLoadingReturnShipping } = useAdminShippingOptions({
    region_id: regionId,
    is_return: true,
  })

	const handleEditShipping = (record: ShippingOption) => {};

	const handleDeleteShipping = (recordId: ShippingOption['id']) => {};

	const handleEditReturnShipping = (record: ShippingOption) => {};

	const handleDeleteReturnShipping = (recordId: ShippingOption['id']) => {};

	const tableShippingColumns = useMemo(
		() => shippingColumns({ handleEdit: handleEditShipping, handleDelete: handleDeleteShipping }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[shippingOptions]
	);

	const tableReturnShippingColumns = useMemo(
		() => shippingColumns({ handleEdit: handleEditReturnShipping, handleDelete : handleDeleteReturnShipping }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[returnShippingOptions]
	);

	return (
		<Modal open={state} handleOk={handleOk} handleCancel={handleCancel} width={800}>
			<Title level={3} className='pb-4'>Vận chuyển</Title>
			<Flex justify="space-between" align="center" className="pb-4">
				<Title level={5}>Tuỳ chọn vận chuyển</Title>
				<Button type="default">Thêm tuỳ chọn</Button>
			</Flex>
			<Table
				columns={tableShippingColumns as any}
				dataSource={shippingOptions ?? []}
				loading={isLoadingShipping}
				rowKey="id"
				pagination={false}
			/>
			<Flex justify="space-between" align="center" className="py-4">
			<Title level={5}>Tuỳ chọn giao hàng trả lại</Title>
				<Button type="default">Thêm tuỳ chọn</Button>
			</Flex>
			<Table
				columns={tableReturnShippingColumns as any}
				dataSource={returnShippingOptions ?? []}
				loading={isLoadingReturnShipping}
				rowKey="id"
				pagination={false}
			/>
		</Modal>
	);
};

export default ShippingModal;
