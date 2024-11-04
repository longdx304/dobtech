import { Title } from '@/components/Typography';
import { SteppedContext } from '@/lib/providers/stepped-modal-provider';
import { displayAmount, extractOptionPrice } from '@/utils/prices';
import { Avatar, Button, Table } from 'antd';
import {
	useAdminGetDiscountByCode,
	useAdminShippingOptions,
} from 'medusa-react';
import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';
import { useNewDraftOrderForm } from '../../hooks/use-new-draft-form';

const Summary = () => {
	const [showAddDiscount, setShowAddDiscount] = useState(false);
	const [discError, setDiscError] = useState(undefined);
	const [code, setCode] = useState<string>('');

	const {
		form,
		context: { items, region: regionObj, selectedShippingOption },
	} = useNewDraftOrderForm();

	const shipping = form.getFieldValue('shipping_address');
	const billing = form.getFieldValue('billing_address');
	const region = form.getFieldValue('region');
	const email = form.getFieldValue('email');
	const discountCode = form.getFieldValue('discount_code');
	const shippingOption = form.getFieldValue('shipping_option');

	const customShippingPrice = form.getFieldValue('custom_shipping_price');

	const { discount, status, isFetching } = useAdminGetDiscountByCode(
		discountCode!,
		{
			enabled: !!discountCode,
		}
	);

	const { shipping_options } = useAdminShippingOptions(
		{ region_id: region?.value },
		{
			enabled: !!region && !!shippingOption,
		}
	);

	const shippingOptionPrice = useMemo(() => {
		if (!shippingOption || !shipping_options) {
			return 0;
		}

		const option = shipping_options.find((o) => o.id === shippingOption.value);

		if (!option) {
			return 0;
		}

		return option.amount || 0;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shipping_options, shippingOption]);

	const itemColumns = [
		{
			title: 'Chi tiết',
			dataIndex: 'details',
			key: 'details',
			render: (_: any, record: any) => (
				<div className="flex min-w-[240px] py-2">
					<div className="h-[40px] w-[30px]">
						{record.thumbnail ? (
							<Image
								className="rounded object-cover"
								src={record.thumbnail}
								alt={record.product_title}
								width={30}
								height={40}
							/>
						) : (
							<div className="h-full w-full bg-gray-200 rounded" />
						)}
					</div>
					<div className="ml-4 flex flex-col">
						<span className="font-medium">{record.product_title}</span>
						<span className="text-gray-500">{record.title}</span>
					</div>
				</div>
			),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'right',
		},
		{
			title: 'Giá (chưa thuế)',
			dataIndex: 'unit_price',
			key: 'unit_price',
			align: 'right',
			render: (price: any) =>
				regionObj && displayAmount(regionObj.currency_code, price),
		},
	];

	const handleAddDiscount = async () => {
		form.setFieldValue('discount_code', code);
	};

	const onDiscountRemove = () => {
		form.setFieldValue('discount_code', undefined);
		setShowAddDiscount(false);
		setCode('');
	};

	return (
		<div className="min-h-[705px]">
			<SummarySection title="Sản phẩm" editIndex={1}>
				<Table
					dataSource={items}
					columns={itemColumns as any}
					pagination={false}
					rowKey="id"
				/>

				{/* {!showAddDiscount && !discount?.rule && (
					<div className="flex justify-end mt-4">
						<Button
							icon={<PlusOutlined />}
							onClick={() => setShowAddDiscount(true)}
						>
							Thêm mã giảm giá
						</Button>
					</div>
				)}

				{showAddDiscount && !discount?.rule && (
					<div className="mt-4">
						<div className="flex items-center gap-2">
							<Input
								placeholder="SUMMER10"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								onFocus={() => setDiscError(undefined)}
							/>
							<Button
								icon={<CloseOutlined />}
								onClick={() => setShowAddDiscount(false)}
							/>
						</div>
						<div className="flex justify-between items-center mt-4">
							{discError && <span className="text-red-500">{discError}</span>}
							<Button
								icon={<PlusOutlined />}
								loading={isFetching}
								onClick={handleAddDiscount}
							>
								Thêm mã giảm giá
							</Button>
						</div>
					</div>
				)} */}

				{/* {discount && regionObj && (
					<Card className="mt-4">
						<div className="flex justify-between items-center mb-4">
							<span>
								Giảm giá
								<span className="text-gray-500 ml-1">
									(Mã: {discount.code})
								</span>
							</span>
							<CloseOutlined
								onClick={onDiscountRemove}
								className="cursor-pointer"
							/>
						</div>
						<div className="flex">
							<div className="border-r pr-6">
								<span className="text-gray-500">Loại</span>
								<span>
									{discount.rule.type === 'fixed'
										? 'Cố định'
										: discount.rule.type === 'percentage'
										? 'Phần trăm'
										: 'Miễn phí vận chuyển'}
								</span>
							</div>
							{discount.rule.type !== 'free_shipping' && (
								<div className="pl-6">
									<span className="text-gray-500">Giá trị</span>
									<span>
										{discount.rule.type === 'fixed'
											? `${displayAmount(
													regionObj.currency_code,
													discount.rule.value
											  )} ${regionObj.currency_code.toUpperCase()}`
											: `${discount.rule.value}%`}
									</span>
								</div>
							)}
						</div>
					</Card>
				)} */}
			</SummarySection>

			<SummarySection title="Khách hàng" editIndex={3}>
				<div className="flex items-center">
					<Avatar className="mr-3" style={{ backgroundColor: '#87d068' }}>
						{shipping?.first_name?.[0] || email?.[0]?.toUpperCase()}
					</Avatar>
					{email}
				</div>
			</SummarySection>

			{selectedShippingOption && (
				<SummarySection title="Chi tiết vận chuyển" editIndex={2}>
					<div className="grid grid-cols-2 gap-6">
						{shipping && (
							<div className="border-r pr-6">
								<div className="text-gray-500">Địa chỉ</div>
								<div>
									{shipping.address_1}, {shipping.address_2}
								</div>
								<div>{`${shipping.postal_code} ${shipping.city}, ${shipping.country_code?.label}`}</div>
							</div>
						)}
						{regionObj && (
							<div>
								<div className="text-gray-500">Phương thức vận chuyển</div>
								<div>
									{selectedShippingOption.name} -
									{customShippingPrice && regionObj ? (
										<span>
											<span className="text-gray-400 line-through mr-2">
												{extractOptionPrice(shippingOptionPrice, regionObj)}
											</span>
											{displayAmount(
												regionObj.currency_code,
												customShippingPrice
											)}
											{regionObj.currency_code.toUpperCase()}
										</span>
									) : (
										extractOptionPrice(
											selectedShippingOption?.amount!,
											regionObj
										)
									)}
								</div>
							</div>
						)}
					</div>
				</SummarySection>
			)}

			{billing && (
				<SummarySection title="Chi tiết thanh toán" editIndex={3}>
					<div className="text-gray-500">Địa chỉ</div>
					<div>
						{billing.address_1}, {billing.address_2}
					</div>
					<div>{`${billing.postal_code} ${billing.city}, ${billing.country_code.label}`}</div>
				</SummarySection>
			)}
		</div>
	);
};

const SummarySection = ({ title, editIndex, children }: any) => {
	const context = useContext(SteppedContext);
	const setStep = context?.setStep;

	return (
		<div className="mt-4 pb-8 border-b border-gray-200 last:border-b-0">
			<div className="flex justify-between items-center mb-4">
				<Title level={5}>{title}</Title>
				<Button type="link" onClick={() => setStep?.(editIndex)}>
					Sửa
				</Button>
			</div>
			{children}
		</div>
	);
};

export default Summary;