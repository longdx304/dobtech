import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { isValidEmail } from '@/utils/is-valid-email';
import { DatePicker, Form } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { LoaderCircle, LockIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import { useAdminSupplier, useAdminSuppliers } from '@/lib/hooks/api/supplier';
import dayjs from 'dayjs';

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
	const { supplier } = useAdminSupplier(supplierId ? supplierId : '', {});

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

		// Set default dates based on supplier's default days
		if (supplierSelect) {
			const today = dayjs();
			if (supplierSelect.estimated_production_time) {
				form.setFieldValue(
					'estimated_production_time',
					today.add(supplierSelect.estimated_production_time, 'day')
				);
			}
			if (supplierSelect.settlement_time) {
				form.setFieldValue(
					'settlement_time',
					today.add(supplierSelect.settlement_time, 'day')
				);
			}
			if (supplierSelect.shipping_started_date) {
				form.setFieldValue(
					'shipping_started_date',
					today.add(supplierSelect.shipping_started_date, 'day')
				);
			}
			if (supplierSelect.warehouse_entry_date) {
				form.setFieldValue(
					'warehouse_entry_date',
					today.add(supplierSelect.warehouse_entry_date, 'day')
				);
			}
			if (supplierSelect.completed_payment_date) {
				form.setFieldValue(
					'completed_payment_date',
					today.add(supplierSelect.completed_payment_date, 'day')
				);
			}
		}

		setSupplierValue(value);
	};

	const email = Form.useWatch('email', form);
	const estimatedProductionTime = Form.useWatch(
		'estimated_production_time',
		form
	);
	const settlementTime = Form.useWatch('settlement_time', form);
	const shippingStartedDate = Form.useWatch('shipping_started_date', form);
	const warehouseEntryDate = Form.useWatch('warehouse_entry_date', form);
	const completedPaymentDate = Form.useWatch('completed_payment_date', form);

	/**
	 * Effect used to enable next step.
	 * A user can go to the next step if valid email, supplier and all date fields are provided.
	 */
	useEffect(() => {
		if (
			!supplierId ||
			!email ||
			!estimatedProductionTime ||
			!settlementTime ||
			!shippingStartedDate ||
			!warehouseEntryDate ||
			!completedPaymentDate
		) {
			disableNext();
			return;
		}
		enableNext();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		email,
		supplierId,
		estimatedProductionTime,
		settlementTime,
		shippingStartedDate,
		warehouseEntryDate,
		completedPaymentDate,
	]);

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
					<>
						<div className="p-4 bg-gray-50 rounded-lg mb-4">
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

						<div className="space-y-4">
							<h3 className="font-semibold text-base">Thông tin thời gian</h3>

							<Form.Item
								label="Thời gian sản xuất dự kiến"
								name="estimated_production_time"
								rules={[
									{
										required: true,
										message: 'Vui lòng chọn thời gian sản xuất',
									},
								]}
							>
								<DatePicker
									className="w-full"
									format="DD/MM/YYYY"
									placeholder="Chọn ngày"
								/>
							</Form.Item>

							<Form.Item
								label="Thời gian thanh toán"
								name="settlement_time"
								rules={[
									{ required: true, message: 'Vui lòng chọn thời gian thanh toán' },
								]}
							>
								<DatePicker
									className="w-full"
									format="DD/MM/YYYY"
									placeholder="Chọn ngày"
								/>
							</Form.Item>

							<Form.Item
								label="Ngày bắt đầu vận chuyển"
								name="shipping_started_date"
								rules={[
									{
										required: true,
										message: 'Vui lòng chọn ngày bắt đầu vận chuyển',
									},
								]}
							>
								<DatePicker
									className="w-full"
									format="DD/MM/YYYY"
									placeholder="Chọn ngày"
								/>
							</Form.Item>

							<Form.Item
								label="Ngày nhập kho"
								name="warehouse_entry_date"
								rules={[
									{ required: true, message: 'Vui lòng chọn ngày nhập kho' },
								]}
							>
								<DatePicker
									className="w-full"
									format="DD/MM/YYYY"
									placeholder="Chọn ngày"
								/>
							</Form.Item>

							<Form.Item
								label="Ngày hoàn thành thanh toán"
								name="completed_payment_date"
								rules={[
									{
										required: true,
										message: 'Vui lòng chọn ngày hoàn thành thanh toán',
									},
								]}
							>
								<DatePicker
									className="w-full"
									format="DD/MM/YYYY"
									placeholder="Chọn ngày"
								/>
							</Form.Item>
						</div>
					</>
				)}
			</Form>
		</div>
	);
};

export default ShippingDetails;
