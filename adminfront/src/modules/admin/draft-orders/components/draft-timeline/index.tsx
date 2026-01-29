import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { useAdminUploadFile, useAdminDeleteFile } from '@/lib/hooks/api/uploads';
import { useAdminDraftOrderUpdateMetadata } from '@/lib/hooks/api/draft-orders';
import { useUser } from '@/lib/providers/user-provider';
import { getErrorMessage } from '@/lib/utils';
import { DraftTimelineEvent } from '../../hooks/use-build-draft-timeline';
import { LineItem, DraftOrder } from '@medusajs/medusa';
import { Empty, message } from 'antd';
import { isEmpty } from 'lodash';
import { FileDown, File as FileIcon, Paperclip } from 'lucide-react';
import { useAdminDraftOrder } from 'medusa-react';
import DraftCreated from './timeline-events/draft-created';
import DraftCompleted from './timeline-events/draft-completed';
import DraftCanceled from './timeline-events/draft-canceled';
import { pdfOrderRes } from '@/modules/admin/orders/components/orders/new-order';
import { generatePdfBlob } from '@/modules/admin/orders/components/orders/new-order/order-pdf';

type Props = {
	draftOrderId: string;
	isLoading: boolean;
	events: DraftTimelineEvent[] | undefined;
	refetchDraftOrder?: () => void;
};

const DraftTimeline = ({ draftOrderId, isLoading, events, refetchDraftOrder }: Props) => {
	const { user } = useUser();
	const uploadFile = useAdminUploadFile();
	const deleteFile = useAdminDeleteFile();
	const updateDraftOrderMetadata = useAdminDraftOrderUpdateMetadata();
	const { draft_order, isLoading: isDraftOrderLoading } = useAdminDraftOrder(draftOrderId);

	const generateFilePdf = async (): Promise<string> => {
		let pdfUrl = '';
		let pdfReq = {} as pdfOrderRes;
		if (!isEmpty(draft_order)) {
			const { cart } = draft_order!;
			const shipping_address = cart?.shipping_address;
			const address = `${shipping_address?.address_1 ?? ''}, ${shipping_address?.address_2 ?? ''
				}, ${shipping_address?.province ?? ''}, ${shipping_address?.city ?? ''
				}, ${shipping_address?.country_code ?? ''}`;

			pdfReq = {
				email: cart?.email ?? '',
				userId: user!.id,
				user: user,
				customer: {
					first_name: shipping_address?.first_name ?? '',
					last_name: shipping_address?.last_name ?? '',
					email: cart?.email ?? '',
					phone: shipping_address?.phone ?? '',
				},
				address,
				lineItems:
					cart?.items?.map((i: LineItem) => ({
						variantId: i.variant_id ?? '',
						quantity: i.quantity,
						unit_price: i.unit_price,
						title: `${i.title} - ${i.description}`,
						sku: i.variant?.sku || '',
					})) ?? [],
				totalQuantity: cart?.items?.reduce((acc: number, i: LineItem) => acc + i.quantity, 0) ?? 0,
				countryCode: shipping_address?.country_code ?? 'vn',
				isSendEmail: false,
			};

			// Generate pdf blob
			const pdfBlob = await generatePdfBlob(pdfReq!);

			// Create a File object
			const fileName = `draft-order.pdf`;

			// Create a File object
			const files = new File([pdfBlob], fileName, {
				type: 'application/pdf',
			});

			// Upload pdf to s3 using Medusa uploads API
			const uploadRes = await uploadFile.mutateAsync({
				files,
				prefix: 'draft-orders',
			});

			pdfUrl = uploadRes.uploads[0].url;
		}

		return pdfUrl;
	};

	const updateDocFileDraftOrder = async () => {
		const hideLoading = message.loading('Đang cập nhật file draft order...', 0);
		let pdfUrl = '';
		
		try {
			pdfUrl = await generateFilePdf();

			let files: any[] = Array.isArray(draft_order?.metadata?.files)
				? draft_order.metadata.files
				: [];

			await updateDraftOrderMetadata.mutateAsync(
				{
					id: draftOrderId,
					metadata: {
						...draft_order?.metadata,
						files: [
							...files,
							{
								url: pdfUrl,
								name: 'Draft Order PDF',
								created_at: new Date().toISOString(),
							},
						],
					},
				},
				{
					onSuccess: () => {
						hideLoading();
						if (refetchDraftOrder) {
							refetchDraftOrder();
						}
						message.success('Cập nhật file draft order thành công');
					},
					onError: async (err: any) => {
						hideLoading();
						// Delete the uploaded PDF if the update fails
						if (pdfUrl) {
							try {
								const fileKey = pdfUrl.split('/').pop();
								if (fileKey) {
									await deleteFile.mutateAsync({ file_key: fileKey });
								}
							} catch (deleteError) {
								console.error('Failed to delete PDF after error:', deleteError);
							}
						}
						message.error(getErrorMessage(err));
					},
				}
			);
		} catch (error) {
			hideLoading();
			// Delete the uploaded PDF if there was an error during generation/upload
			if (pdfUrl) {
				try {
					const fileKey = pdfUrl.split('/').pop();
					if (fileKey) {
						await deleteFile.mutateAsync({ file_key: fileKey });
					}
				} catch (deleteError) {
					console.error('Failed to delete PDF after error:', deleteError);
				}
			}
			message.error('Đã xảy ra lỗi khi tạo file PDF');
		}
	};

	const actions = [
		{
			label: <span className="w-full">{'Cập nhật file draft order'}</span>,
			key: 'update-file',
			icon: <FileDown size={18} />,
			onClick: updateDocFileDraftOrder,
		},
	];

	if (!events?.length && !draft_order?.metadata?.files) {
		return (
			<Card loading={isLoading || isDraftOrderLoading}>
				<Empty description="Chưa có sự kiện nào xảy ra" />
			</Card>
		);
	}

	const files = (draft_order?.metadata?.files as any[]) || [];

	return (
		<Card
			loading={isLoading || isDraftOrderLoading}
			className="px-4 max-h-[calc(100vh-80px)] overflow-y-auto sticky top-[20px]"
		>
			<div>
				<Flex align="center" justify="space-between" className="pb-4">
					<Title level={4}>{`Dòng thời gian`}</Title>
					<div className="flex justify-end items-center gap-4">
						<ActionAbles actions={actions} />
					</div>
				</Flex>
				<div className="flex flex-col text-xs">
					{files.map((file: any, index: number) => (
						<div key={`file-${index}`} className="mb-4">
							<div className="flex items-center justify-between">
								<div className="gap-x-2 flex items-center">
									<div className="h-5 w-5 text-gray-500">
										<FileIcon size={20} />
									</div>
									<div className="font-semibold text-[12px]">File đính kèm</div>
								</div>
							</div>
							<div className="gap-x-2 flex">
								<div className="pt-base flex w-5 justify-center">
									<div className="min-h-[24px] w-px bg-gray-200" />
								</div>
								<div className="font-normal mt-0 w-full">
									<div className="flex items-center">
										<div className="font-normal text-gray-500 text-[12px]">
											{new Date(file.created_at).toLocaleString('vi-VN')}
										</div>
										<span className="mx-2">
											<div className="aspect-square h-[3px] w-[3px] bg-gray-500 rounded-full" />
										</span>
										<div className="flex justify-start items-center gap-x-1">
											<Paperclip size={12} className="text-gray-500" />
											<a
												href={file.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-500 text-[12px] hover:text-blue-600 underline cursor-pointer"
											>
												{file.name}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
					{events?.map((event, i) => {
						return (
							<div key={i}>
								{switchOnType(event)}
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
};

export default DraftTimeline;

function switchOnType(event: DraftTimelineEvent) {
	switch (event.type) {
		case 'created':
			return <DraftCreated event={event} />;
		case 'completed':
			return <DraftCompleted event={event} />;
		case 'canceled':
			return <DraftCanceled event={event} />;
		case 'note':
			// For now, we'll skip notes as they would require additional components
			return null;
		default:
			return null;
	}
}
