import { Flex } from '@/components/Flex';
import { Input, TextArea } from '@/components/Input';
import DatePicker from '@/components/Input/DatePicker';
import { Radio, RadioGroup } from '@/components/Radio';
import { Switch } from '@/components/Switch';
import { Text, Title } from '@/components/Typography';
import { DetailFormType } from '@/types/price';
import { CheckboxProps, Col, Empty, Form, FormProps, Row, Spin } from 'antd';
import { Search } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';
import _ from 'lodash';
import { Checkbox, CheckboxGroup } from '@/components/Checkbox';
import { useAdminCustomerGroups } from 'medusa-react';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/Button';

type Props = {
	setDetailForm: (data: DetailFormType) => void;
	setCurrentStep: (nextStep: number) => void;
	onCancel: () => void;
};

const DetailForm: FC<Props> = ({ setDetailForm, setCurrentStep, onCancel }) => {
	const [form] = Form.useForm();

	const onFinish: FormProps<DetailFormType>['onFinish'] = (values) => {
		setDetailForm(values);
		setCurrentStep(1);
	};

	return (
		<Form form={form} onFinish={onFinish} className="px-4">
			<PriceListType />
			<PriceListGeneral />
			<PriceListCustomerGroups form={form} />
			<Flex justify="flex-end" gap="small" className="mt-4">
				<Button type="default" onClick={onCancel}>
					Huỷ
				</Button>
				<Button htmlType="submit">Tiếp theo</Button>
			</Flex>
		</Form>
	);
};

export default DetailForm;

const PriceListType = ({}) => {
	return (
		<Row gutter={[16, 8]} className="pt-4">
			<Col span={24}>
				<Flex vertical className="mb-4">
					<Text strong className="text-sm">
						Loại giá
					</Text>
					<Text className="text-[13px] text-gray-600">
						Chọn loại danh sách giá bạn muốn tạo
					</Text>
				</Flex>
				<Form.Item
					name={['type', 'value']}
					initialValue="sale"
					className="mb-0"
					colon={false}
					labelCol={{ span: 24 }}
				>
					<RadioGroup className="w-full flex">
						<Radio
							value="sale"
							className="border border-solid border-gray-200 rounded-md px-4 py-2"
						>
							<Flex vertical justify="flex-start" align="flex-start">
								<Text className="text-[13px]" strong>
									Khuyến mãi
								</Text>
								<Text className="text-[13px] text-gray-600">
									Sử dụng điều này nếu bạn đang tạo một chương trình khuyến mãi
								</Text>
							</Flex>
						</Radio>
						<Radio
							value="override"
							className="border border-solid border-gray-200 rounded-md px-4 py-2"
						>
							<Flex vertical justify="flex-start" align="flex-start">
								<Text strong className="text-[13px]">
									Ghi đè
								</Text>
								<Text className="text-[13px] text-gray-600">
									Sử dụng điều này nếu bạn muốn ghi đè giá
								</Text>
							</Flex>
						</Radio>
					</RadioGroup>
				</Form.Item>
			</Col>
		</Row>
	);
};

const PriceListGeneral = ({}) => {
	const [isStartDate, setIsStartDate] = useState<boolean>(false);
	const [isEndDate, setIsEndDate] = useState<boolean>(false);
	return (
		<Row gutter={[16, 16]} className="pt-6">
			<Col span={24}>
				<Flex vertical>
					<Text strong className="text-sm">
						Thông tin chung
					</Text>
					<Text className="text-[13px] text-gray-600">
						Chọn tiêu đề và mô tả cho danh sách.
					</Text>
				</Flex>
			</Col>
			<Col xs={24} lg={12}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['genral', 'name']}
					label="Tên"
					className="mb-0"
					rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
				>
					<Input placeholder="Khuyến mãi Black Friday" />
				</Form.Item>
			</Col>
			<Col xs={24}>
				<Form.Item
					labelCol={{ span: 24 }}
					name={['genral', 'description']}
					label="Mô tả"
					className="mb-0"
					rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
				>
					<TextArea placeholder="Mô tả về chương trình khuyến mãi" rows={2} />
				</Form.Item>
			</Col>
			<Col span={24} className="mt-2">
				<Flex justify="space-between" align="center">
					<Flex vertical>
						<Text strong className="text-sm">
							Danh sách giá có ngày bắt đầu
						</Text>
						<Text className="text-[13px] text-gray-600">
							Lên lịch các giá trị ghi đè để kích hoạt trong tương lai
						</Text>
					</Flex>
					<Switch
						value={isStartDate}
						onChange={(checked: boolean) => setIsStartDate(checked)}
						className=""
					/>
				</Flex>
				{isStartDate && (
					<Form.Item
						labelCol={{ span: 24 }}
						name={['dates', 'starts_at']}
						label="Ngày bắt đầu"
						className="mb-0 mt-4"
						rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
					>
						<DatePicker placeholder="Chọn ngày bắt đầu" className="w-[300px]" />
					</Form.Item>
				)}
			</Col>
			<Col span={24} className="mt-2">
				<Flex justify="space-between" align="center">
					<Flex vertical>
						<Text strong className="text-sm">
							Danh sách giá có ngày kết thúc
						</Text>
						<Text className="text-[13px] text-gray-600">
							Lên lịch các giá trị ghi đè để ngừng hoạt động trong tương lai
						</Text>
					</Flex>
					<Switch
						value={isEndDate}
						onChange={(checked: boolean) => setIsEndDate(checked)}
						className=""
					/>
				</Flex>
				{isEndDate && (
					<Form.Item
						labelCol={{ span: 24 }}
						name={['dates', 'ends_at']}
						label="Ngày kết thúc"
						className="mb-0 mt-4"
						rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
					>
						<DatePicker
							placeholder="Chọn ngày kết thúc"
							className="w-[300px]"
						/>
					</Form.Item>
				)}
			</Col>
		</Row>
	);
};

const PAGE_SIZE = 10;
const PriceListCustomerGroups = ({ form }: { form: any }) => {
	const [isCustomerGroups, setIsCustomerGroups] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [checkList, setCheckList] = useState<string[]>([]);

	const { customer_groups, count, isLoading, isError } = useAdminCustomerGroups(
		{
			q: searchValue,
			offset: (currentPage - 1) * PAGE_SIZE,
			limit: PAGE_SIZE,
			expand: 'customers',
		},
		{
			keepPreviousData: true,
		}
	);

	const checkAll = customer_groups?.length === checkList?.length;
	const indeterminate =
		checkList?.length > 0 && checkList?.length < (customer_groups?.length || 0);

	const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
		if (customer_groups?.length === 0) return;
		if (customer_groups) {
			setCheckList(
				e.target.checked
					? customer_groups?.map((item: any) => item.id! as string)
					: []
			);
			form.setFieldsValue({
				customer_groups: {
					ids: e.target.checked
						? customer_groups?.map((item: any) => item.id! as string)
						: [],
				},
			});
			return;
		}
	};

	const onChange = (list: string[]) => {
		setCheckList(list);
	};

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);
	return (
		<Row gutter={[16, 16]} className="pt-4">
			<Col span={24}>
				<Flex justify="space-between" align="center">
					<Flex vertical>
						<Text strong className="text-sm">
							Khả năng sử dụng cho khách hàng
						</Text>
						<Text className="text-[13px] text-gray-600">
							Xác định nhóm khách hàng nnào mà giá ghi đề nên áp dụng
						</Text>
					</Flex>
					<Switch
						value={isCustomerGroups}
						onChange={(checked: boolean) => setIsCustomerGroups(checked)}
						className=""
					/>
				</Flex>
			</Col>
			{isCustomerGroups && (
				<Col
					span={24}
					className="mt-2 border border-solid border-gray-200 rounded-[6px]"
				>
					<Flex
						align="center"
						justify="space-between"
						className="p-4 border-0 border-b border-solid border-gray-200"
					>
						<Title level={4} className="">
							Nhóm khách hàng
						</Title>
						<Input
							placeholder="Nhập tên nhóm khách hàng"
							className="w-[250px] text-xs"
							prefix={<Search size={16} />}
							onChange={handleChangeDebounce}
						/>
					</Flex>
					<Flex
						align="center"
						justify="space-between"
						className="p-4 border-0 border-b border-solid border-gray-200"
					>
						<Flex align="center" justify="flex-start" gap="middle">
							<Checkbox
								indeterminate={indeterminate}
								onChange={onCheckAllChange}
								checked={checkAll}
							/>
							<Text>Tên</Text>
						</Flex>
						<Text>Thành viên</Text>
					</Flex>
					<Flex className="w-full border-0 border-b border-solid border-gray-200 ">
						{_.isEmpty(customer_groups) && (
							<Empty
								image={Empty.PRESENTED_IMAGE_DEFAULT}
								className="w-full flex justify-center items-center"
							/>
						)}
						{isLoading && <Spin className="" />}
						{!isLoading && !_.isEmpty(customer_groups) && (
							<Form.Item
								labelCol={{ span: 24 }}
								name={['customer_groups', 'ids']}
								className="mb-0 w-full"
							>
								<CheckboxGroup
									className="w-full"
									value={['cgrp_01HZEJ56CZWGPJKAGFNAY9B53Q']}
									onChange={onChange}
								>
									{customer_groups?.map((item: any) => (
										<Flex
											align="center"
											justify="space-between"
											className="p-4 w-full"
											key={item.id}
										>
											<Flex align="center" justify="flex-start" gap="middle">
												<Checkbox value={item.id} />
												<Text>{item?.name}</Text>
											</Flex>
											<Text>{item?.customers?.length || 0}</Text>
										</Flex>
									))}
								</CheckboxGroup>
							</Form.Item>
						)}
					</Flex>
					<Flex className="w-full p-4" justify="flex-end" align="center">
						<Pagination
							current={currentPage}
							total={Math.floor(count ?? 0 / (PAGE_SIZE ?? 0))}
							pageSize={PAGE_SIZE}
							onChange={setCurrentPage}
							showTotal={(total: number, range: number[]) =>
								`${range[0]}-${range[1]} trong ${total} nhóm`
							}
						/>
					</Flex>
				</Col>
			)}
		</Row>
	);
};
