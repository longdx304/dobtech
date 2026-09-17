import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { isValidEmail } from '@/utils/is-valid-email';
import mapAddressToForm from '@/utils/map-address-to-form';
import { Customer } from '@medusajs/medusa';
import { Form, Radio } from 'antd';
import { debounce } from 'lodash';
import { LoaderCircle, LockIcon, PlusIcon } from 'lucide-react';
import { useAdminNextCustomerCode } from '@/lib/hooks/api/customer';
import { useAdminCustomer, useAdminCustomers } from 'medusa-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import CreateCustomerModal from '../create-customer-modal';
import AddressForm, { AddressType } from './address-form';

type ValueType = {
	label: string;
	value: string;
};

type Props = {
	onValidityChange?: (valid: boolean) => void;
	onCustomerIdChange?: (customerId?: string) => void;
};

const ShippingDetails = ({ onValidityChange, onCustomerIdChange }: Props = {}) => {
	const { disableNext, enableNext } = useStepModal();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { nextCode } = useAdminNextCustomerCode({ enabled: isCreateModalOpen });
	const [sameAsShipping, setSameAsShipping] = useState(true);
	const [searchValue, setSearchValue] = useState<ValueType | undefined>();

	const {
		context: { validCountries },
		form,
	} = useNewDraftOrderForm();
	const [addNew, setAddNew] = useState(() => {
		const savedAddress = form.getFieldValue('shipping_address');
		return Boolean(
			form.getFieldValue('customer_id') &&
			!form.getFieldValue('shipping_address_id') &&
			savedAddress?.address_1
		);
	});
	const reportValidity = useCallback((valid: boolean) => {
		if (onValidityChange) {
			onValidityChange(valid);
		} else if (valid) {
			enableNext();
		} else {
			disableNext();
		}
	}, [disableNext, enableNext, onValidityChange]);

	const customerId = Form.useWatch('customer_id', form);
	const shippingAddressId = Form.useWatch('shipping_address_id', form);
	const { customers, count, isLoading } = useAdminCustomers(
		{
			offset: 0,
			limit: 100,
			q: searchValue?.label || undefined,
		},
		{
			keepPreviousData: true,
		}
	);

	// get customer
	const { customer } = useAdminCustomer(customerId, {
		enabled: !!customerId,
	});

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue({
			label: value,
			value: '',
		});
	}, 800);

	const customerOptions = useMemo(() => {
		const options = (customers ?? []).map(({ id, first_name, last_name, email }) => ({
			label: `${last_name || ''} ${first_name || ''} (${email})`,
			value: id,
		}));

		// The selected customer may no longer be in the latest search result/page.
		// Keep its label available so Ant Select never falls back to showing a raw id.
		if (customer && !options.some((option) => option.value === customer.id)) {
			options.unshift({
				label: `${customer.last_name || ''} ${customer.first_name || ''} (${customer.email})`,
				value: customer.id,
			});
		}

		return options;
	}, [customer, customers]);

	const setEmptyAddressForCustomer = (selectedCustomer?: Customer) => {
		const address = {
			first_name: selectedCustomer?.first_name ?? '',
			last_name: selectedCustomer?.last_name ?? '',
			phone: selectedCustomer?.phone ?? '',
			company: 'Chưa có',
			address_1: '',
			address_2: '',
			city: '',
			province: '',
			country_code: 'vn',
			postal_code: '70000',
		};
		form.setFieldValue('shipping_address', address);
		form.setFieldValue('billing_address', address);
	};

	const handleSelect = (value: string) => {
		if (!value) return;
		const customerSelect =
			customers?.find((item) => item.id === value) ??
			(customer?.id === value ? customer : undefined);
		const isDifferentCustomer = form.getFieldValue('customer_id') !== value;
		form.setFieldValue('customer_id', value);
		form.setFieldValue('email', customerSelect?.email);
		if (isDifferentCustomer) {
			form.setFieldValue('shipping_address_id', undefined);
			form.setFieldValue('billing_address_id', undefined);
			setEmptyAddressForCustomer(customerSelect);
			setAddNew(false);
		}
		onCustomerIdChange?.(value);
	};

	// get valid addresses
	const validAddresses = useMemo(() => {
		if (!customer) {
			return [];
		}

		const validCountryCodes = validCountries.map(({ value }) =>
			String(value).toLowerCase()
		);

		return customer.shipping_addresses.filter(({ country_code }) => {
			if (!country_code) {
				return true;
			}
			return validCountryCodes.includes(country_code.toLowerCase());
		});
	}, [customer, validCountries]);

	const onCreateNew = () => {
		form.setFieldValue('shipping_address_id', undefined);
		form.setFieldValue('billing_address_id', undefined);
		setEmptyAddressForCustomer(customer);
		setAddNew(true);
	};

	const onSelectExistingAddress = (id: string) => {
		if (!customer) {
			return;
		}

		const address = customer.shipping_addresses?.find((a) => a.id === id);

		if (address) {
			const mappedAddress = mapAddressToForm(address);

			form.setFieldValue('shipping_address_id', id);
			form.setFieldValue('shipping_address', mappedAddress);
			form.setFieldValue('billing_address', mappedAddress);
			setAddNew(false);
		}
	};

	const email = Form.useWatch('email', form);

	const shippingAddress = Form.useWatch('shipping_address', form);

	/**
	 * Effect used to enable next step.
	 * A user can go to the next step if valid email is provided and all required address info is filled.
	 */
	useEffect(() => {
		if (!email || !isValidEmail(email)) {
			reportValidity(false);
			return;
		}

		// If an existing address is selected via radio button
		if (shippingAddressId && validAddresses.length && !addNew) {
			reportValidity(true);
			return;
		}

		if (shippingAddress) {
			if (
				!shippingAddress.first_name ||
				!shippingAddress.address_1 ||
				!shippingAddress.country_code
			) {
				reportValidity(false);
			} else {
				reportValidity(true);
			}
		} else {
			reportValidity(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shippingAddress, email, shippingAddressId, validAddresses, addNew, reportValidity]);

	useEffect(() => {
		if (!customer) return;

		const selectedAddressId = form.getFieldValue('shipping_address_id');
		const savedAddress = form.getFieldValue('shipping_address');

		// Returning from a later step remounts this component. Preserve the
		// existing radio selection and populated form instead of resetting it.
		if (selectedAddressId) {
			const selectedAddress = validAddresses.find(
				(address) => address.id === selectedAddressId
			);
			if (selectedAddress && !savedAddress?.address_1) {
				const mappedAddress = mapAddressToForm(selectedAddress);
				form.setFieldValue('shipping_address', mappedAddress);
				form.setFieldValue('billing_address', mappedAddress);
			}
			setAddNew(false);
			return;
		}

		if (!savedAddress?.address_1 && !addNew) {
			setEmptyAddressForCustomer(customer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer, validAddresses]);

	// Add this handler function
	const handleCustomerCreated = (newCustomer: Customer) => {
		form.setFieldValue('customer_id', newCustomer.id);
		form.setFieldValue('email', newCustomer.email);
		form.setFieldValue('shipping_address_id', undefined);
		form.setFieldValue('billing_address_id', undefined);
		setEmptyAddressForCustomer(newCustomer);
		setAddNew(false);
		onCustomerIdChange?.(newCustomer.id);
	};

	return (
		<div className="flex h-max flex-col gap-y-8">
			<div>
				<div className="flex gap-x-2 items-center">
					<Form.Item
						name={'customer_id'}
						label="Tìm khách hàng có sẵn"
						className="flex-1 truncate"
					>
						<Select
							className="w-full"
							placeholder="Chọn khách hàng"
							allowClear
							onClear={() => {
								form.setFieldValue('customer_id', undefined);
								form.setFieldValue('email', undefined);
								form.setFieldValue('shipping_address_id', undefined);
								form.setFieldValue('billing_address_id', undefined);
								form.setFieldValue('shipping_address', undefined);
								form.setFieldValue('billing_address', undefined);
								setAddNew(false);
								onCustomerIdChange?.(undefined);
							}}
							options={customerOptions}
							autoClearSearchValue={false}
							filterOption={false}
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
									'Không tìm thấy biến thể sản phẩm'
								)
							}
						/>
					</Form.Item>
					<div className="flex items-end">
						<Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
							<PlusIcon size={20} />
						</Button>
					</div>
				</div>

				<Form.Item label="Email" name="email">
					<Input
						value={email}
						onChange={(e) => form.setFieldValue('email', e.target.value)}
						placeholder="lebron@james.com"
						disabled={!!customerId}
						prefix={
							customerId ? (
								<LockIcon size={16} className="text-grey-40" />
							) : undefined
						}
					/>
				</Form.Item>

				{validAddresses.length && !addNew ? (
					<>
						<Form.Item name={'shipping_address_id'} label="Chọn địa chỉ có sẵn">
							<Radio.Group
								onChange={(e) => {
									return onSelectExistingAddress(e.target.value);
								}}
							>
								{validAddresses.map((sa) => (
									<Radio key={sa.id} value={sa.id}>
										{`${sa.last_name || ''} ${sa.first_name || ''} `}
										<div>{`${sa.address_1 || ''}, ${sa.address_2 || ''} ${sa.postal_code || ''
											} ${sa.city || ''} ${sa.country_code?.toUpperCase() || ''
											}`}</div>
									</Radio>
								))}
							</Radio.Group>
						</Form.Item>
						<Button onClick={onCreateNew}>Tạo địa chỉ mới</Button>
					</>
				) : (
					<div>
						<AddressForm
							form={form}
							countryOptions={validCountries}
							type={AddressType.SHIPPING}
							customer={customer}
						/>

						{!sameAsShipping && (
							<AddressForm
								form={form}
								countryOptions={validCountries}
								type={AddressType.BILLING}
								customer={customer}
							/>
						)}
					</div>
				)}
			</div>

			{/* Hidden input for shipping address */}
			<Form.Item name="shipping_address" hidden>
				<Input type="hidden" />
			</Form.Item>

			<Form.Item name="billing_address" hidden>
				<Input type="hidden" />
			</Form.Item>

			<CreateCustomerModal
				visible={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCustomerCreated={handleCustomerCreated}
				nextCustomerCode={nextCode}
			/>
		</div>
	);
};

export default ShippingDetails;
