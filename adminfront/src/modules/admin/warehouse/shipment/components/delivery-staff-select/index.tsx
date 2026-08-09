import { Select } from '@/components/Select';
import { useAdminDeliveryStaff } from '@/lib/hooks/api/fulfullment';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { getDeliveryStaffLabel } from '../../utils/delivery-assignment';

type DeliveryStaffSelectProps = {
	value?: string | null;
	onChange: (value?: string) => void;
	excludeId?: string | null;
	placeholder: string;
	allowClear?: boolean;
	disabled?: boolean;
};

const DeliveryStaffSelect = ({
	value,
	onChange,
	excludeId,
	placeholder,
	allowClear = false,
	disabled = false,
}: DeliveryStaffSelectProps) => {
	const [searchValue, setSearchValue] = useState('');
	const { delivery_staff: deliveryStaff, isLoading } =
		useAdminDeliveryStaff(searchValue);

	const handleSearch = useMemo(
		() => debounce((search: string) => setSearchValue(search.trim()), 400),
		[]
	);

	useEffect(() => () => handleSearch.cancel(), [handleSearch]);

	const options = useMemo(
		() =>
			(Array.isArray(deliveryStaff) ? deliveryStaff : [])
				.filter((user) => user?.id && user.id !== excludeId)
				.map((user) => ({
					value: user.id,
					label: getDeliveryStaffLabel(user),
				})),
		[deliveryStaff, excludeId]
	);

	return (
		<Select
			value={value || undefined}
			onChange={onChange}
			onSearch={handleSearch}
			options={options}
			placeholder={placeholder}
			allowClear={allowClear}
			showSearch
			filterOption={false}
			loading={isLoading}
			disabled={disabled}
			notFoundContent={
				isLoading ? 'Đang tải nhân sự...' : 'Không tìm thấy nhân sự phù hợp'
			}
			className="w-full"
		/>
	);
};

export default DeliveryStaffSelect;
