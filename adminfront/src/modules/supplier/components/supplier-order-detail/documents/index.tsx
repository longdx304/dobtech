import useToggleState from '@/lib/hooks/use-toggle-state';
import { SupplierOrder, SupplierOrderDocument } from '@/types/supplier';
import { Modal as AntdModal, message } from 'antd';
import UploadModal from './modal-upload';
import { getErrorMessage } from '@/lib/utils';
import { Card } from '@/components/Card';
import { Empty } from '@/components/Empty';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Paperclip, Plus, Trash2 } from 'lucide-react';
import { useAdminDeleteFile } from '@/lib/hooks';
import { useAdminSupplierOrderDeleteDocument } from '@/modules/supplier/hooks';
import Link from 'next/link';

type Props = {
	order: SupplierOrder | undefined;
	isLoading: boolean;
};

const Documents = ({ order, isLoading }: Props) => {
	const deleteFile = useAdminDeleteFile();
	const deleteDocument = useAdminSupplierOrderDeleteDocument(order?.id || '');
	const { state, onOpen, onClose } = useToggleState();

	const handleRemoveDoc = async (docId: string, docName: string) => {
		AntdModal.confirm({
			title: 'Xác nhận xoá tài liệu',
			content: 'Bạn có chắc chắn muốn xoá tài liệu này?',
			onOk: async () => {
				await deleteFile.mutateAsync(
					{
						file_key: docName,
					},
					{
						onSuccess: async () => {
							await deleteDocument.mutateAsync({
								documentId: docId,
							});
							message.success('Xoá tài liệu thành công');
							console.log('first');
						},
						onError: (error: any) => {
							console.log('error', error);
							// message.error(getErrorMessage(error));
						},
					}
				);
			},
		});
	};

	const getFileName = (url: string) => {
		const parts = url.split('/');
		return parts[parts.length - 1];
	};
	return (
		<Card loading={isLoading} className="px-4">
			{!order && <Empty description="Không tìm thấy đơn hàng" />}
			{order && (
				<div>
					<Flex align="center" justify="space-between" className="pb-2">
						<Title level={4}>{`Danh sách tài liệu`}</Title>
						<div className="flex justify-end items-center gap-4">
							<Button
								type="text"
								shape="circle"
								icon={<Plus size={20} />}
								onClick={onOpen}
							/>
						</div>
					</Flex>
					<Flex vertical gap={4} className="pt-8">
						{order?.documents?.map((doc: SupplierOrderDocument) => (
							<Flex
								key={doc.id}
								justify="space-between"
								align="center"
								className="group"
							>
								<Flex justify="flex-start" align="center" gap={'small'}>
									<Paperclip
										size={20}
										// color="#6B7280"
										className="text-gray-500 group-hover:text-blue-600"
									/>
									<Link
										href={doc.document_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-500 text-sm text-nowrap group-hover:text-blue-600"
									>
										{getFileName(doc.document_url)}
									</Link>
								</Flex>
								<Trash2
									size={14}
									color="red"
									className="hidden group-hover:block cursor-pointer"
									onClick={() =>
										handleRemoveDoc(doc.id, getFileName(doc.document_url))
									}
								/>
							</Flex>
						))}
					</Flex>
				</div>
			)}
			{state && (
				<UploadModal state={state} handleCancel={onClose} orderId={order!.id} />
			)}
		</Card>
	);
};

export default Documents;
