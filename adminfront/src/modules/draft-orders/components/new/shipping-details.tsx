import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { Option } from '@/types/products';
import isNullishObject from '@/utils/is-nullish-object';
import { isValidEmail } from '@/utils/is-valid-email';
import mapAddressToForm from '@/utils/map-address-to-form';
import { Customer } from '@medusajs/medusa';
import { Form, Radio } from 'antd';
import { LockIcon, PlusIcon } from 'lucide-react';
import { useAdminCustomer, useAdminCustomers } from 'medusa-react';
import { useEffect, useMemo, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';
import CreateCustomerModal from '../create-customer-modal';
import AddressForm, { AddressType } from './address-form';

const ShippingDetails = () => {
	const [addNew, setAddNew] = useState(false);
	const { disableNext, enableNext } = useStepModal();
	const [customerOptions, setCustomerOptions] = useState<Option[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [sameAsShipping, setSameAsShipping] = useState(true);

	const {
		context: { validCountries },
		form,
	} = useNewDraftOrderForm();

	const customerId = Form.useWatch('customer_id', form);
	const shippingAddressId = Form.useWatch('shipping_address_id', form);
	const { customers, isLoading, count } = useAdminCustomers();

	// select customer options
	useEffect(() => {
		if (customers) {
			setCustomerOptions(
				customers.map(({ id, first_name, last_name, email }) => ({
					label: `${first_name || ''} ${last_name || ''} (${email})`,
					value: id,
				}))
			);
		}
	}, [customers]);

	// get customer
	const { customer } = useAdminCustomer(customerId, {
		enabled: !!customerId,
	});

	// get valid addresses
	const validAddresses = useMemo(() => {
		if (!customer) {
			return [];
		}

		const validCountryCodes = validCountries.map(({ value }) => value);

		return customer.shipping_addresses.filter(
			({ country_code }) =>
				!country_code || validCountryCodes.includes(country_code)
		);
	}, [customer, validCountries]);

	const onCustomerSelect = (customerId: string) => {
		// Find the selected customer in customerOptions
		const selectedCustomer = customerOptions.find(
			(option) => option.value === customerId
		);

		if (selectedCustomer) {
			// Extract email from the label (assuming label format is "First Last (email)")
			const emailMatch = /\(([^()]+)\)$/.exec(selectedCustomer.label);
			const email = emailMatch ? emailMatch[1] : '';

			// Set the customer_id and email fields in the form
			form.setFieldValue('customer_id', selectedCustomer.value);
			form.setFieldValue('email', email);
		}
	};

	const onCreateNew = () => {
		form.setFieldValue('shipping_address_id', null);
		setAddNew(true);
	};

	const onSelectExistingAddress = (id: string) => {
		if (!customer) {
			return;
		}

		const address = customer.shipping_addresses?.find((a) => a.id === id);

		if (address) {
			const mappedAddress = mapAddressToForm(address);

			form.setFieldValue('shipping_address', mappedAddress);
			form.setFieldValue('billing_address', mappedAddress);
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
			disableNext();
			return;
		}

		// If an existing address is selected via radio button
		if (shippingAddressId && validAddresses.length && !addNew) {
			enableNext();
			return;
		}

		if (shippingAddress && !isNullishObject(shippingAddress)) {
			if (
				!shippingAddress.first_name ||
				!shippingAddress.last_name ||
				!shippingAddress.address_1 ||
				!shippingAddress.city ||
				!shippingAddress.country_code ||
				!shippingAddress.postal_code
			) {
				disableNext();
			} else {
				enableNext();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shippingAddress, email, shippingAddressId, validAddresses, addNew]);

	useEffect(() => {
		// Reset shipping address info when a different customer is selected
		// or when "Create new" is clicked
		form.setFieldValue('shipping_address', {
			first_name: '',
			last_name: '',
			phone: '',
			address_1: '',
			address_2: '',
			city: '',
			country_code: null,
			province: '',
			postal_code: '',
		});
		form.setFieldValue('shipping_address_id', null);
		// eslint-disable-next-line
	}, [customerId, addNew, validAddresses]);

	useEffect(() => {
		setAddNew(false);
	}, [customerId]);

	// Add this handler function
	const handleCustomerCreated = (newCustomer: Customer) => {
		setCustomerOptions((prev) => [
			...prev,
			{
				label: `${newCustomer.first_name} ${newCustomer.last_name} (${newCustomer.email})`,
				value: newCustomer.id,
			},
		]);

		// Select the newly created customer
		onCustomerSelect(newCustomer.id);
	};

	return (
		<div className="flex h-max flex-col gap-y-8">
			<Form form={form} layout="vertical">
				<div className="flex gap-x-2 items-center">
					<Form.Item
						name={'customer_id'}
						label="Tìm khách hàng có sẵn"
						className="flex-1 truncate"
					>
						<Select
							showSearch
							options={customerOptions}
							onChange={(val) => onCustomerSelect(val)}
							value={customerId || null}
							placeholder="Tìm khách hàng có sẵn"
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
										{`${sa.first_name} ${sa.last_name}`}
										<div>{`${sa.address_1}, ${sa.address_2} ${sa.postal_code} ${
											sa.city
										} ${sa.country_code?.toUpperCase()}`}</div>
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
						/>

						{!sameAsShipping && (
							<AddressForm
								form={form}
								countryOptions={validCountries}
								type={AddressType.BILLING}
							/>
						)}
					</div>
				)}
			</Form>

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
				totalCustomers={count || 0}
			/>
		</div>
	);
};

export default ShippingDetails;
