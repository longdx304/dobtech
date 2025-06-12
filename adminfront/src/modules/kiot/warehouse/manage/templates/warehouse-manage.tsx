'use client';
import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Tabs } from '@/components/Tabs';
import { Text, Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { TabsProps } from 'antd';
import { Download, Plus } from 'lucide-react';
import { FC } from 'react';
import ModalAddWarehouse from '../../manage/components/modal-add-warehouse';
import LocationManage from './location-manage';
import ProductManage from './product-manage';
import { useExportWarehouseData } from '@/lib/hooks/api/kiot/mutations';
import * as XLSX from 'xlsx';
import { message } from 'antd';
import { getErrorMessage } from '@/lib/utils';
type Props = {};

const KiotWarehouseManage: FC<Props> = ({}) => {
	const exportWarehouseData = useExportWarehouseData();
	const {
		state: stateWarehouse,
		onOpen: openWarehouse,
		onClose: closeWarehouse,
	} = useToggleState(false);

	const itemTabs: TabsProps['items'] = [
		{
			key: 'products',
			label: 'Sản phẩm',
			children: <ProductManage />,
		},
		{
			key: 'locaitons',
			label: 'Vị trí',
			children: <LocationManage />,
		},
	];

	const handleExportData = async () => {
		await exportWarehouseData.mutateAsync(
			{}, // Match the expected request format
			{
				onSuccess: async (data) => {
					console.log('🚀 ~ onSuccess: ~ data:', data);
					// Use the download URL from response
					if (data.downloadUrl) {
						const { downloadUrl, fileKey } = data;
						// Tạo một request để kiểm tra nội dung tệp
						const response = await fetch(downloadUrl);
						const blob = await response.blob();

						// Đảm bảo mã hóa UTF-8
						const reader = new FileReader();
						reader.onload = () => {
							const csvText = reader.result;

							// Chuyển đổi CSV thành workbook
							const workbook = XLSX.read(csvText, { type: 'string' });

							// Chuyển đổi workbook thành tệp Blob
							const wopts: XLSX.WritingOptions = {
								bookType: 'xlsx',
								type: 'array',
							};
							const xlsxBlob = new Blob([XLSX.write(workbook, wopts)], {
								type: 'application/octet-stream',
							});

							// Tạo và kích hoạt link tải xuống cho tệp XLSX
							const link = document.createElement('a');
							link.href = URL.createObjectURL(xlsxBlob);
							link.setAttribute(
								'download',
								`${fileKey.split('/').pop()?.replace('.csv', '.xlsx')}`
							);
							document.body.appendChild(link); // Append to body instead of a specific element
							link.click();
							document.body.removeChild(link); // Remove from body after click
						};
						reader.readAsText(blob, 'utf-8');
					}
					message.success('Xuất file kiểm kê thành công!');
				},
				onError: (error) => {
					message.error(`Xuất file thất bại: ${getErrorMessage(error)}`);
				},
			}
		);
	};

	return (
		<Flex vertical gap={12}>
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Danh sách vị trí kho</Title>
				<Text className="text-gray-600">
					Trang danh sách các sản phẩm ở từng vị trí kho.
				</Text>
			</Flex>
			<Card loading={false} className="w-full" bordered={false}>
				<Tabs items={itemTabs} centered />
				<FloatButton
					style={{ insetBlockEnd: 108 }}
					icon={<Plus color="white" size={20} strokeWidth={2} />}
					type="primary"
					onClick={openWarehouse}
				/>
				<FloatButton
					icon={<Download color="black" size={20} strokeWidth={2} />}
					// type="primary"
					onClick={handleExportData}
					tooltip={<span className="text-white">Xuất dữ liệu</span>}
				/>
				{stateWarehouse && (
					<ModalAddWarehouse
						isModalOpen={stateWarehouse}
						onClose={closeWarehouse}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default KiotWarehouseManage;
