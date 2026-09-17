import { Select } from '@/components/Select';
import { EPermissions, hasEmployeePermission } from '@/types/account';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { useAdminUser, useAdminUsers } from 'medusa-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
	required?: boolean;
};

const SalesPersonSelect = ({ required = false }: Props) => {
	const [searchValue, setSearchValue] = useState('');
	const form = Form.useFormInstance();
	const selectedSalesPersonId = Form.useWatch('sales_person_id', form);
	const { users, isLoading } = useAdminUsers(
		{
			offset: 0,
			limit: 50,
			q: searchValue || undefined,
		},
		{
			keepPreviousData: true,
		}
	);
	const { user: selectedSalesPerson, isLoading: isSelectedSalesPersonLoading } =
		useAdminUser(selectedSalesPersonId || '', {
			enabled: Boolean(selectedSalesPersonId),
		});

	const handleSearch = useMemo(
		() => debounce((value: string) => setSearchValue(value.trim()), 500),
		[]
	);

	useEffect(() => {
		return () => handleSearch.cancel();
	}, [handleSearch]);

	const options = useMemo(() => {
		const result = (users ?? [])
				.filter((user) =>
					hasEmployeePermission(
						(user as typeof user & { permissions?: string }).permissions,
						EPermissions.Sale
					)
				)
				.map((user) => {
					const fullName = [user.first_name, user.last_name]
						.filter(Boolean)
						.join(' ')
						.trim();

					return {
						value: user.id,
						label: fullName ? `${fullName} (${user.email})` : user.email,
					};
				});

		if (
			selectedSalesPerson &&
			!result.some((option) => option.value === selectedSalesPerson.id)
		) {
			const fullName = [
				selectedSalesPerson.first_name,
				selectedSalesPerson.last_name,
			]
				.filter(Boolean)
				.join(' ')
				.trim();
			result.unshift({
				value: selectedSalesPerson.id,
				label: fullName
					? `${fullName} (${selectedSalesPerson.email})`
					: selectedSalesPerson.email,
			});
		}

		return result;
	}, [selectedSalesPerson, users]);

	return (
		<Form.Item
			name="sales_person_id"
			label="Nhân viên bán hàng"
			className="mt-6"
			rules={
				required
					? [
							{
								required: true,
								message: 'Vui lòng chọn nhân viên bán hàng',
							},
					  ]
					: undefined
			}
		>
			<Select
				allowClear
				showSearch
				filterOption={false}
				loading={isLoading || isSelectedSalesPersonLoading}
				onSearch={handleSearch}
				options={options}
				placeholder="Chọn nhân viên bán hàng"
				notFoundContent={
					isLoading ? 'Đang tải nhân viên...' : 'Không tìm thấy nhân viên'
				}
			/>
		</Form.Item>
	);
};

export default SalesPersonSelect;
