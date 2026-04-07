'use client';

import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import {
	useAdminAddCustomerAddress,
	useAdminUpdateCustomerAddress,
} from '@/lib/hooks/api/customer/mutations';
import { getErrorMessage } from '@/lib/utils';
import AddressContactForm from '@/modules/admin/orders/components/common/address-form/address-contact-form';
import AddressLocationForm from '@/modules/admin/orders/components/common/address-form/address-location-form';
import {
	AddressContactFormType,
	AddressLocationFormType,
} from '@/types/order';
import { isoAlpha2Countries } from '@/utils/countries';
import { Address, AddressCreatePayload, Country } from '@medusajs/medusa';
import { Divider, Form, message } from 'antd';
import { useAdminRegions } from 'medusa-react';
import { FC, useEffect, useMemo } from 'react';

type AddressModalFormType = {
	contact: AddressContactFormType;
	location: AddressLocationFormType;
};

type Props = {
	open: boolean;
	onClose: () => void;
	customerId: string;
	address: Address | null;
	onSaved?: () => void;
};

const CustomerAddressModal: FC<Props> = ({
	open,
	onClose,
	customerId,
	address,
	onSaved,
}) => {
	const [form] = Form.useForm<AddressModalFormType>();
	const { regions } = useAdminRegions();

	const addAddress = useAdminAddCustomerAddress(customerId);
	const updateAddress = useAdminUpdateCustomerAddress(customerId);

	const countryOptions = useMemo(() => {
		const map = new Map<string, string>();
		regions?.forEach((r) => {
			r.countries?.forEach((c: Country) => {
				map.set(c.iso_2.toLowerCase(), c.display_name);
			});
		});
		if (map.size === 0) {
			return Object.entries(isoAlpha2Countries).map(([code, name]) => ({
				label: name,
				value: code.toLowerCase(),
			}));
		}
		return Array.from(map.entries()).map(([value, label]) => ({
			label,
			value,
		}));
	}, [regions]);

	useEffect(() => {
		if (!open) return;
		form.setFieldsValue(getDefaultValues(address));
	}, [address, open, form]);

	const onFinish = async (values: AddressModalFormType) => {
		const { contact, location } = values;
		const countryCode =
			typeof location.country_code === 'string'
				? location.country_code
				: (location.country_code as { value?: string })?.value;

		const basePayload: AddressCreatePayload = {
			first_name: contact.first_name,
			last_name: contact.last_name,
			phone: contact.phone ?? '',
			company: contact.company ?? '',
			address_1: location.address_1,
			address_2: location.address_2 ?? '',
			city: location.city,
			province: location.province ?? '',
			postal_code: location.postal_code ?? '',
			country_code: countryCode ?? '',
			metadata: {},
		};

		try {
			if (address?.id) {
				await updateAddress.mutateAsync({
					addressId: address.id,
					payload: {
						...basePayload,
					},
				});
				message.success('Đã cập nhật địa chỉ');
			} else {
				await addAddress.mutateAsync(basePayload);
				message.success('Đã thêm địa chỉ');
			}
			onSaved?.();
			onClose();
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

	const loading = addAddress.isLoading || updateAddress.isLoading;

	return (
		<SubmitModal
			title={address ? 'Sửa địa chỉ giao hàng' : 'Thêm địa chỉ giao hàng'}
			open={open}
			onOk={onClose}
			handleCancel={onClose}
			isLoading={loading}
			form={form}
			width={700}
		>
			<Form form={form} onFinish={onFinish} className="pt-4">
				<Title level={5}>Liên hệ</Title>
				<AddressContactForm form={form} />

				<Divider className="my-3" />

				<Title level={5}>Vị trí</Title>
				<AddressLocationForm form={form} countryOptions={countryOptions} />
			</Form>
		</SubmitModal>
	);
};

const getDefaultValues = (address?: Address | null): AddressModalFormType => {
	return {
		contact: {
			first_name: address?.first_name ?? '',
			last_name: address?.last_name ?? '',
			phone: address?.phone ?? '',
			company: address?.company ?? null,
		},
		location: {
			address_1: address?.address_1 ?? '',
			address_2: address?.address_2 ?? null,
			city: address?.city ?? '',
			province: address?.province ?? null,
			country_code: address?.country_code?.toLowerCase() ?? '',
			postal_code: address?.postal_code ?? '',
		},
	};
};

export default CustomerAddressModal;
