import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { isValidEmail } from '@/utils/is-valid-email';
import { Form } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { LoaderCircle, LockIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import { useAdminSupplier, useAdminSuppliers } from '@/lib/hooks/api/supplier';

type ValueType = {
	label: string;
	value: string;
};

const ShippingDetails = () => {
	const { disableNext, enableNext } = useStepModal();
	const [searchValue, setSearchValue] = useState<ValueType | undefined>();
	const [supplierValue, setSupplierValue] = useState<string>('');

	const { form } = useNewDraftOrderForm();

	const supplierId = Form.useWatch('supplier_id', form);
	const { suppliers, isLoading } = useAdminSuppliers(
		{
			offset: 0,
			limit: 100,
			q: searchValue?.label || undefined,
		},
		{
			keepPreviousData: true,
		}
	);

	// get supplier
	const { supplier } = useAdminSupplier(supplierId!, {
		enabled: !!supplierId,
	});

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue({
			label: value,
			value: '',
		});
	}, 800);

	const supplierOptions = useMemo(() => {
		if (!suppliers) return [];

		return suppliers.map(({ id, supplier_name, email }) => ({
			label: `${supplier_name} (${email})`,
			value: id,
		}));
	}, [suppliers]);

	const handleSelect = async (data: ValueType) => {
		const { label, value } = data as ValueType;
		if (!value || !label) return;

		const supplierSelect = suppliers?.find((item) => item.id === value);
		form.setFieldValue('supplier_id', value);
		form.setFieldValue('email', supplierSelect?.email);

		setSupplierValue(value);
	};

	const email = Form.useWatch('email', form);

	/**
	 * Effect used to enable next step.
	 * A user can go to the next step if valid email and supplier are provided.
	 */
	useEffect(() => {
		if (!supplierId || !email || !isValidEmail(email)) {
			disableNext();
			return;
		}
		enableNext();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, supplierId]);

	return (
		<div className="flex h-max flex-col gap-y-8">
			<Form form={form} layout="vertical">
				<Form.Item
					name={'supplier_id'}
					label="Tìm nhà cung cấp"
					className="flex-1 truncate"
					rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
				>
					<Select
						className="w-full"
						placeholder="Chọn nhà cung cấp"
						allowClear
						options={supplierOptions}
						labelInValue
						autoClearSearchValue={false}
						filterOption={false}
						value={!isEmpty(supplierValue) ? supplierValue : undefined}
						onSearch={debounceFetcher}
						onSelect={handleSelect}
						showSearch
						notFoundContent={
							isLoading ? (
								<LoaderCircle
									className="animate-spin w-full flex justify-center"
									size={18}
									strokeWidth={3}
								/>
							) : (
								'Không tìm thấy nhà cung cấp'
							)
						}
					/>
				</Form.Item>

				<Form.Item 
					label="Email" 
					name="email"
					rules={[
						{ required: true, message: 'Vui lòng nhập email' },
						{ type: 'email', message: 'Email không hợp lệ' }
					]}
				>
					<Input
						value={email}
						onChange={(e) => form.setFieldValue('email', e.target.value)}
						placeholder="supplier@example.com"
						disabled={!!supplierId}
						prefix={
							supplierId ? (
								<LockIcon size={16} className="text-grey-40" />
							) : undefined
						}
					/>
				</Form.Item>

				{supplier && (
					<div className="p-4 bg-gray-50 rounded-lg">
						<h3 className="font-semibold mb-2">Thông tin nhà cung cấp</h3>
						<div className="space-y-2 text-sm">
							<div>
								<span className="text-gray-600">Tên: </span>
								<span className="font-medium">{supplier.supplier_name}</span>
							</div>
							<div>
								<span className="text-gray-600">Email: </span>
								<span className="font-medium">{supplier.email}</span>
							</div>
							<div>
								<span className="text-gray-600">Số điện thoại: </span>
								<span className="font-medium">{supplier.phone || '-'}</span>
							</div>
							<div>
								<span className="text-gray-600">Địa chỉ: </span>
								<span className="font-medium">{supplier.address || '-'}</span>
							</div>
						</div>
					</div>
				)}
			</Form>
		</div>
	);
};

export default ShippingDetails;
